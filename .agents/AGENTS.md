# Project-Scoped Rules

## Environment Configuration
- Java 21 is globally installed at `C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot\`. 
- If running commands in a terminal session that was opened before the installation, reload the environment variables or set `JAVA_HOME` manually:
  ```powershell
  $env:JAVA_HOME="C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot"
  $env:PATH = "C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot\bin;" + $env:PATH
  ```
