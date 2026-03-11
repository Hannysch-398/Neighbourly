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