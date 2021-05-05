package commons;

import io.openvidu.java.client.OpenViduRole;

public class User {
    String sessionID;
    String name;
    OpenViduRole role;
    double x;
    double y;

    public User(String name, OpenViduRole role, double initialX, double initialY) {
        this.name = name;
        this.role = role;
        this.sessionID = "";
        this.x = initialX;
        this.y = initialY;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSessionID() {
        return sessionID;
    }

    public void setSessionID(String sessionID) {
        this.sessionID = sessionID;
    }

    public OpenViduRole getRole() {
        return role;
    }

    public void setRole(OpenViduRole role) {
        this.role = role;
    }

    public double[] getPos() {
        return new double[]{this.x, this.y};
    }

    public void setPos(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public String toString() {
        return name + "\t" + x + "\t" + y;
    }
}
