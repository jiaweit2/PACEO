package io.openvidu.mvc.java;

public class OpenViduServerData {
    private String username;
    private int initialX;
    private int initialY;

    public OpenViduServerData(String username, int initialX, int initialY) {
        this.username = username;
        this.initialX = initialX;
        this.initialY = initialY;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getInitialX() {
        return initialX;
    }

    public void setInitialX(int initialX) {
        this.initialX = initialX;
    }

    public int getInitialY() {
        return initialY;
    }

    public void setInitialY(int initialY) {
        this.initialY = initialY;
    }
}
