package io.openvidu.mvc.java;

public class JoinSessionResponse {
    private String token;
    private OpenViduServerData openViduServerData;

    public JoinSessionResponse(String token, OpenViduServerData openViduServerData) {
        this.token = token;
        this.openViduServerData = openViduServerData;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public OpenViduServerData getOpenViduServerData() {
        return openViduServerData;
    }

    public void setOpenViduServerData(OpenViduServerData openViduServerData) {
        this.openViduServerData = openViduServerData;
    }
}
