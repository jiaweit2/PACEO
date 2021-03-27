package commons;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class UsersManager {

    private static UsersManager INSTANCE;
    private Map<String, User> users = new ConcurrentHashMap<>();

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
        return this.users.get(username);
    }

    public List<User> getUserList() { return new ArrayList<User>(users.values());}

    public boolean containsUser(String username) {
        return this.users.containsKey(username);
    }
}
