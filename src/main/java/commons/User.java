package commons;

import io.openvidu.java.client.OpenViduRole;

public class User {
    String name;
    OpenViduRole role;

    public User(String name, OpenViduRole role) {
        this.name = name;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public OpenViduRole getRole() {
        return role;
    }

    public void setRole(OpenViduRole role) {
        this.role = role;
    }
}
