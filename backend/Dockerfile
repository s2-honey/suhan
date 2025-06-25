# 1. Java 17 JDK가 설치된 경량 리눅스 이미지 사용
FROM openjdk:17-jdk-slim

# 2. 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# 3. JAR 파일을 복사 (Gradle 빌드 후 생성되는 파일 경로 기준)
COPY build/libs/*.jar app.jar

# 4. 컨테이너 실행 시 JAR 파일 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
