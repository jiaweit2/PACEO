package commons;

import io.openvidu.java.client.OpenViduRole;

public class User {
    String name;
    OpenViduRole role;
    int x;
    int y;

    public User(String name, OpenViduRole role) {
        this.name = name;
        this.role = role;
        this.x = 0;
        this.y = 0;
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

    public int[] getPos() {return new int[]{this.x, this.y};}

    public void setPos(int x, int y) {
        this.x = x; this.y = y;
    }

    public String toString() {
        return name + "\t" + x + "\t" + y;
    }
}
