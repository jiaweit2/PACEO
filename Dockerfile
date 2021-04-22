FROM openjdk:8-jdk-alpine
COPY target/paceo-2.17.0.jar paceo-2.17.0.jar
ENTRYPOINT ["java","-jar","/paceo-2.17.0.jar"]