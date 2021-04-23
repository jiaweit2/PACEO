package commons;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class UsersManager {

    private static UsersManager INSTANCE;
    private Map<String, User> users = new ConcurrentHashMap<>();
    private Map<String, String> sessionIDToUser = new ConcurrentHashMap<>();

    private UsersManager() {
    }

    public static UsersManager getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new UsersManager();
        }
        return INSTANCE;
    }

    public void addUser(User user) {
        this.users.put(user.getName(), user);
    }

    public void removeUser(String username) {
        this.users.remove(username);
    }

    public User getUser(String username) {
        if (users.containsKey(username)){
            return users.get(username);
        } else {
            return null;
        }
    }

    public void setSessionIDToUser(String sessionID, String username) {this.sessionIDToUser.put(sessionID, username); }

    public User getUserBySessionID(String sessionID) {
        if (sessionIDToUser.containsKey(sessionID)) {
            return this.getUser(sessionIDToUser.get(sessionID));
        } else {
            return null;
        }
    }

    public List<User> getUserList() { return new ArrayList<User>(users.values());}

    public boolean containsUser(String username) {
        return this.users.containsKey(username);
    }
}
