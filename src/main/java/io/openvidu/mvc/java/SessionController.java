package io.openvidu.mvc.java;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpSession;

import commons.User;
import commons.UsersManager;
import org.springframework.beans.factory.annotation.Autowired;
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

import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.ConnectionType;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduRole;
import io.openvidu.java.client.Session;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Controller
public class SessionController {

    private final String ROOM_SESSION_NAME = "ROOM";
    private final OpenVidu openVidu;
    private Map<String, Session> mapSessions = new ConcurrentHashMap<>();

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

        if (httpSession.getAttribute("loggedUser") == null) {
            httpSession.setAttribute("loggedUser", username);
        }
        System.out.println("Getting sessionId and token | {sessionName}={" + ROOM_SESSION_NAME + "}");
        String serverData = "{\"serverData\": \"" + httpSession.getAttribute("loggedUser") + "\"}";
        ConnectionProperties connectionProperties = new ConnectionProperties.Builder().type(ConnectionType.WEBRTC)
                .role(OpenViduRole.PUBLISHER).data(serverData).build();
        String token;
        if (this.mapSessions.get(ROOM_SESSION_NAME) != null) {
            System.out.println("Existing session " + ROOM_SESSION_NAME);
            token = joinGameRoom(model, httpSession, username, connectionProperties);
        } else {
            System.out.println("New session " + ROOM_SESSION_NAME);
            token = startNewGameRoom(model, httpSession, username, connectionProperties);
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
    public String setPos(@Payload String message){
        String[] payload = message.split("\t");
        User user = this.usersManager.getUser(payload[0]);
        System.out.println(payload[0]+" moves to ("+payload[1]+","+payload[2]+")");
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


    private String joinGameRoom(Model model, HttpSession httpSession, String username, ConnectionProperties connectionProperties) {
        try {
            String token = this.mapSessions.get(ROOM_SESSION_NAME).createConnection(connectionProperties).getToken();
            this.setModelAttributes(model, httpSession, username, token);
            return token;
        } catch (Exception e) {
            throw new RuntimeException("Failed to join game");
        }
    }

    private String startNewGameRoom(Model model, HttpSession httpSession, String username, ConnectionProperties connectionProperties) {
        try {

            Session session = this.openVidu.createSession();
            String token = session.createConnection(connectionProperties).getToken();
            this.mapSessions.put(ROOM_SESSION_NAME, session);
            this.setModelAttributes(model, httpSession, username, token);
            return token;
        } catch (Exception e) {
            throw new RuntimeException("Failed to join game", e);
        }
    }

    private void setModelAttributes(Model model, HttpSession httpSession, String username, String token) {
        model.addAttribute("sessionName", ROOM_SESSION_NAME);
        model.addAttribute("token", token);
        model.addAttribute("nickName", username);
        model.addAttribute("userName", httpSession.getAttribute("loggedUser"));
    }

    private void addUserIfMissing(String username) {
        if (!this.usersManager.containsUser(username)) {
            User user = new User(username, OpenViduRole.PUBLISHER);
            this.usersManager.addUser(user);
        }
    }

    private void checkUserLogged(HttpSession httpSession) throws Exception {
        if (httpSession == null || httpSession.getAttribute("loggedUser") == null) {
            throw new Exception("User not logged");
        }
    }

}
