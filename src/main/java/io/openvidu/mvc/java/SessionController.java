package io.openvidu.mvc.java;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpSession;

import commons.User;
import commons.UsersManager;
import org.springframework.beans.factory.annotation.Value;
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

@Controller
public class SessionController {

    private final String ROOM_SESSION_NAME = "ROOM";

    // OpenVidu object as entrypoint of the SDK
    private OpenVidu openVidu;

    // Collection to pair session names and OpenVidu Session objects
    private Map<String, Session> mapSessions = new ConcurrentHashMap<>();
    // Collection to pair session names and tokens (the inner Map pairs tokens and
    // role associated)
    private Map<String, Map<String, OpenViduRole>> mapSessionNamesTokens = new ConcurrentHashMap<>();

    // URL where our OpenVidu server is listening
    private String OPENVIDU_URL;
    // Secret shared with our OpenVidu server
    private String SECRET;

    private UsersManager usersManager;

    public SessionController(@Value("${openvidu.secret}") String secret, @Value("${openvidu.url}") String openviduUrl) {
        this.SECRET = secret;
        this.OPENVIDU_URL = openviduUrl;
        this.openVidu = new OpenVidu(OPENVIDU_URL, SECRET);
        this.usersManager = UsersManager.getInstance();
    }

    @RequestMapping(value = "/session", method = RequestMethod.POST)
    public void joinSession(@RequestBody String username, Model model, HttpSession httpSession) {

        if (httpSession.getAttribute("loggedUser") == null) {
            httpSession.setAttribute("loggedUser", username);
        }
        System.out.println("Getting sessionId and token | {sessionName}={" + ROOM_SESSION_NAME + "}");
        this.addUserIfMissing(username);
        String serverData = "{\"serverData\": \"" + httpSession.getAttribute("loggedUser") + "\"}";
        ConnectionProperties connectionProperties = new ConnectionProperties.Builder().type(ConnectionType.WEBRTC)
                .role(OpenViduRole.PUBLISHER).data(serverData).build();
        if (this.mapSessions.get(ROOM_SESSION_NAME) != null) {
            // Session already exists
            System.out.println("Existing session " + ROOM_SESSION_NAME);
            joinGameRoom(model, httpSession, username, connectionProperties);
        } else {
            // New session
            System.out.println("New session " + ROOM_SESSION_NAME);
            startNewGameRoom(model, httpSession, username, connectionProperties);
        }
    }

    @RequestMapping(value = "/leave-session", method = RequestMethod.POST)
    public String removeUser(@RequestParam(name = "session-name") String sessionName,
                             @RequestParam(name = "token") String token, Model model, HttpSession httpSession) throws Exception {

        // To be implemented
        try {
            checkUserLogged(httpSession);
        } catch (Exception e) {
            return "index";
        }
        System.out.println("Removing user | sessioName=" + sessionName + ", token=" + token);

        // If the session exists ("TUTORIAL" in this case)
        if (this.mapSessions.get(sessionName) != null && this.mapSessionNamesTokens.get(sessionName) != null) {

            // If the token exists
            if (this.mapSessionNamesTokens.get(sessionName).remove(token) != null) {
                // User left the session
                if (this.mapSessionNamesTokens.get(sessionName).isEmpty()) {
                    // Last user left: session must be removed
                    this.mapSessions.remove(sessionName);
                }
                return "redirect:/dashboard";

            } else {
                // The TOKEN wasn't valid
                System.out.println("Problems in the app server: the TOKEN wasn't valid");
                return "redirect:/dashboard";
            }

        } else {
            // The SESSION does not exist
            System.out.println("Problems in the app server: the SESSION does not exist");
            return "redirect:/dashboard";
        }
    }

    private void joinGameRoom(Model model, HttpSession httpSession, String username, ConnectionProperties connectionProperties) {
        try {

            // Generate a new token with the recently created connectionProperties
            String token = this.mapSessions.get(ROOM_SESSION_NAME).createConnection(connectionProperties).getToken();

            // Update our collection storing the new token
            this.mapSessionNamesTokens.get(ROOM_SESSION_NAME).put(token, OpenViduRole.PUBLISHER);
            this.setModelAttributes(model, httpSession, username, token);

        } catch (Exception e) {
            // If error just return dashboard.html template
            model.addAttribute("username", httpSession.getAttribute("loggedUser"));
        }
    }

    private void startNewGameRoom(Model model, HttpSession httpSession, String username, ConnectionProperties connectionProperties) {
        try {

            // Create a new OpenVidu Session
            Session session = this.openVidu.createSession();
            // Generate a new token with the recently created connectionProperties
            String token = session.createConnection(connectionProperties).getToken();

            // Store the session and the token in our collections
            this.mapSessions.put(ROOM_SESSION_NAME, session);
            this.mapSessionNamesTokens.put(ROOM_SESSION_NAME, new ConcurrentHashMap<>());
            this.mapSessionNamesTokens.get(ROOM_SESSION_NAME).put(token, OpenViduRole.PUBLISHER);
            this.setModelAttributes(model, httpSession, username, token);
        } catch (Exception e) {
            // If error just return dashboard.html template
            model.addAttribute("username", httpSession.getAttribute("loggedUser"));
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
