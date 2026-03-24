# 🏠 Neighbourly

Welcome to **Neighbourly**! This guide will help you get the development environment up and running, covering the database, backend, and frontend.

---

## 🛠️ Infrastructure (Database & Docker)

We use **Docker** to manage the database and required services.

1.  **Start Docker:** Ensure your Docker Desktop or daemon is active.
2.  **Launch Containers:** Run the following command from the project root:
    ```bash
    docker compose up -d
    ```

> Tip:
> The `-d` (detached) flag runs containers in the background, keeping your terminal free for other commands.

---
##  Git (Github)

Beispiel Branchname:
```bash
NeBo-1-example-name-from-the-ticket
```

## ☕ Backend (Spring Boot)

The backend is built with **Spring Boot** and managed via **Gradle**.

1.  **Navigate to the backend folder:**
    ```bash
    cd backend
    ```
2.  **Run the application:**
    ```bash
    # Windows
    .\gradlew bootRun

    # macOS/Linux
    ./gradlew bootRun
    ```

---

## 🎨 Frontend (Angular)

The frontend is an **Angular** application located in the `frontend/frontend` subdirectory.

1.  **Navigate to the frontend source:**
    ```bash
    cd frontend/frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    ng serve
    ```
4.  **Access the App:** Open your browser and go to [http://localhost:4200](http://localhost:4200).

---

## 💡 Quick Tips

* **Prerequisites:** Make sure you have **Node.js**, **Java 17+**, and **Docker** installed.
* **Database Connection:** If the backend throws a connection error on the first try, wait a few seconds for the Docker container to fully initialize and try the `bootRun` command again.

## 🔄 First-Time Setup (Database Reset & Users)

If you just pulled the project or the database setup has changed, follow these steps to ensure everything is initialized correctly.

1. **Stop and remove existing containers and volumes:**
   ```bash
   docker compose down -v
   ```

2. **Start fresh containers:**
   ```bash
   docker compose up -d
   ```

   > This will initialize the database and automatically run the setup scripts (roles, users, permissions).

3. **Wait a few seconds** for the database to fully start.

4. **Login with your personal database user:**

   Each developer has their own DB user. Use your assigned credentials in your IDE (e.g. IntelliJ):

    - **Host:** `localhost`
    - **Port:** `5432`
    - **Database:** `neighbourly`
    - **User:** `<your_name>_dev` (e.g. `yasin_dev`)
    - **Password:** your assigned password

5. **Test the connection**  
   If it fails the first time, wait a few seconds and try again (container startup delay).

---

## 🧠 Notes

- The database setup (users, roles, permissions) is automatically created via Docker init scripts.
- If something is broken or outdated, always start with:
  ```bash
  docker compose down -v
  ```
- Never use the admin user (`neighbourly_admin`) for normal development.
