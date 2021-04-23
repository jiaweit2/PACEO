package io.openvidu.mvc.java;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpSession;

import commons.User;
import commons.UsersManager;
import org.springframework.beans.factory.annotation.Autowired;
import io.openvidu.java.client.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class SessionController {

    private final String ROOM_SESSION_NAME = "ROOM";
    private final OpenVidu openVidu;
    private String activeSessionId;

    private UsersManager usersManager;

    @Autowired
    private SimpMessagingTemplate template;

    @EventListener
    public void onSocketDisconnected(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        String sessionID = sha.getSessionId();
        User user = this.usersManager.getUserBySessionID(sessionID);
        if (user != null){
            System.out.println("[Disonnected] " + user.getName());
            userLeave(user.getName());
        }

    }

    public SessionController(@Value("${openvidu.secret}") String secret, @Value("${openvidu.url}") String openviduUrl) {
        this.openVidu = new OpenVidu(openviduUrl, secret);
        this.usersManager = UsersManager.getInstance();
    }

    @RequestMapping(value = "/session", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> joinSession(@RequestBody String username, Model model, HttpSession httpSession) {

        System.out.println("Getting sessionId and token | {sessionName}={" + ROOM_SESSION_NAME + "}");
        String serverData = "{\"serverData\": \"" + httpSession.getAttribute("loggedUser") + "\"}";
        ConnectionProperties connectionProperties = new ConnectionProperties.Builder().type(ConnectionType.WEBRTC)
                .role(OpenViduRole.PUBLISHER).data(serverData).build();
        String token;
        Session activeSession = this.getActiveRoomSession();
        if (activeSession != null) {
            System.out.println("Existing session " + ROOM_SESSION_NAME);
            token = joinGameRoom(connectionProperties, activeSession);
        } else {
            System.out.println("New session " + ROOM_SESSION_NAME);
            token = startNewGameRoom(connectionProperties);
        }
        return new ResponseEntity<>(token, HttpStatus.ACCEPTED);
    }

    @RequestMapping(value = "/leave", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public void leaveGame(
            @RequestParam(name = "token") String token) {

        System.out.println("Removing user | sessioName=" + ROOM_SESSION_NAME + ", token=" + token);
        // To Be Implemented
        // use userLeave
    }

    @MessageMapping("/pos")
    @SendTo("/topic/pos")
    public String setPos(@Payload String message) {
        String[] payload = message.split("\t");
        User user = this.usersManager.getUser(payload[0]);
        System.out.println(payload[0] + " moves to (" + payload[1] + "," + payload[2] + ")");
        user.setPos(Integer.parseInt(payload[1]), Integer.parseInt(payload[2]));
        return message;
    }

    @MessageMapping("/userJoin")
    @SendTo("/topic/userCurrList")
    public String userJoin(@Payload String message) throws Exception {
        String[] payload = message.split("\t");
        this.addUserIfMissing(payload[0]);
        this.usersManager.setSessionIDToUser(payload[1], payload[0]);
        User u = this.usersManager.getUser(payload[0]);
        u.setSessionID(payload[1]);
        String response = "";
        List<User> users = this.usersManager.getUserList();
        for(User user: users) {
            response += user.toString() + "\n";
        }
        System.out.println("Connected: "+payload[0]);
        return response;
    }

    public void userLeave(String username){
        this.usersManager.removeUser(username);
//        String response = "";
//        List<User> users = this.usersManager.getUserList();
//        for(User user: users) {
//            response += user.toString() + "\n";
//        }
        System.out.println("LEAVE");
        this.template.convertAndSend("/topic/userCurrList", "LEAVE"+"\t"+username);
    }


    private String joinGameRoom(ConnectionProperties connectionProperties, Session activeSession) {
        try {
            return activeSession.createConnection(connectionProperties).getToken();
        } catch (OpenViduHttpException e) {
            if (e.getStatus() == HttpStatus.NOT_FOUND.value()) {
                String errorMessage = String.format("Session %s no longer exists.  Starting a new room", this.activeSessionId);
                System.out.println(errorMessage);
                return startNewGameRoom(connectionProperties);
            }
            throw new RuntimeException("Failed to join room", e);
        } catch (OpenViduJavaClientException e) {
            throw new RuntimeException("Failed to join room", e);
        }
    }

    private String startNewGameRoom(ConnectionProperties connectionProperties) {
        try {
            Session session = this.openVidu.createSession();
            this.activeSessionId = session.getSessionId();
            return session.createConnection(connectionProperties).getToken();
        } catch (Exception e) {
            throw new RuntimeException("Failed to join game", e);
        }
    }

    private Session getActiveRoomSession() {
        if (StringUtils.isBlank(this.activeSessionId)) {
            return null;
        }
        List<Session> activeSessions = this.openVidu.getActiveSessions();
        for (Session session : activeSessions) {
            if (session.getSessionId().equals(this.activeSessionId)) {
                return session;
            }
        }
        return null;
    }

    private void addUserIfMissing(String username) {
        if (!this.usersManager.containsUser(username)) {
            User user = new User(username, OpenViduRole.PUBLISHER);
            this.usersManager.addUser(user);
        }
    }
}
