### There are 5 types of commit message
1. Refactor: Any refactoring changes.
2. Feature: Any new class or independent function created.
3. Update: Any new functions created, changed or removed.
4. Dev: Any changes to the development environment and experience.
5. Fixed: Any bug Fixed
### Commit message template
- The whole message has to be in 1 line.
- Each commit type is seperated by a dot "."
- Each changes inside a commit type is seperated by a ";"
    - If the changes are made to sub-files or functions inside classes or files, the file/class has to be put to the start of the message and following with a greater sign ">"
- E.g.:
    - Update: Class A > remove function B; Dockerfile > update base image. Fixed: wrong dependency url. Feature: Class A > Now can call service 123 for additional data.
