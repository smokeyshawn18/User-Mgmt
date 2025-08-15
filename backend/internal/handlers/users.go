package handlers

import (
	"api/internal/models"
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type UserHandler struct {
    db *sql.DB
}

func NewUserHandler(db *sql.DB) *UserHandler {
    return &UserHandler{db: db}
}

// GetUsers handles GET /users request
func (h *UserHandler) GetUsers() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        rows, err := h.db.Query("SELECT id, name, email FROM users")
        if err != nil {
            http.Error(w, "Failed to fetch users", http.StatusInternalServerError)
            return
        }
        defer rows.Close()

        var users []models.User
        for rows.Next() {
            var user models.User
            if err := rows.Scan(&user.ID, &user.Name, &user.Email); err != nil {
                http.Error(w, "Error scanning user data", http.StatusInternalServerError)
                return
            }
            users = append(users, user)
        }

        if err = rows.Err(); err != nil {
            http.Error(w, "Error iterating users", http.StatusInternalServerError)
            return
        }

        json.NewEncoder(w).Encode(users)
    }
}

// GetUser handles GET /users/{id} request
func (h *UserHandler) GetUser() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        vars := mux.Vars(r)
        id, err := strconv.Atoi(vars["id"])
        if err != nil {
            http.Error(w, "Invalid user ID", http.StatusBadRequest)
            return
        }

        var user models.User
        err = h.db.QueryRow("SELECT id, name, email FROM users WHERE id = $1", id).
            Scan(&user.ID, &user.Name, &user.Email)

        if err == sql.ErrNoRows {
            http.Error(w, "User not found", http.StatusNotFound)
            return
        }
        if err != nil {
            http.Error(w, "Error fetching user", http.StatusInternalServerError)
            return
        }

        json.NewEncoder(w).Encode(user)
    }
}

// CreateUser handles POST /users request
func (h *UserHandler) CreateUser() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var user models.User
        if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
            http.Error(w, "Invalid request payload", http.StatusBadRequest)
            return
        }
        defer r.Body.Close()

        err := h.db.QueryRow(
            "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id",
            user.Name, user.Email,
        ).Scan(&user.ID)

        if err != nil {
            http.Error(w, "Error creating user", http.StatusInternalServerError)
            return
        }

        w.WriteHeader(http.StatusCreated)
        json.NewEncoder(w).Encode(user)
    }
}

// UpdateUser handles PUT /users/{id} request
func (h *UserHandler) UpdateUser() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        vars := mux.Vars(r)
        id, err := strconv.Atoi(vars["id"])
        if err != nil {
            http.Error(w, "Invalid user ID", http.StatusBadRequest)
            return
        }

        var user models.User
        if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
            http.Error(w, "Invalid request payload", http.StatusBadRequest)
            return
        }
        defer r.Body.Close()

        result, err := h.db.Exec(
            "UPDATE users SET name = $1, email = $2 WHERE id = $3",
            user.Name, user.Email, id,
        )
        if err != nil {
            http.Error(w, "Error updating user", http.StatusInternalServerError)
            return
        }

        rowsAffected, err := result.RowsAffected()
        if err != nil || rowsAffected == 0 {
            http.Error(w, "User not found", http.StatusNotFound)
            return
        }

        user.ID = id
        json.NewEncoder(w).Encode(user)
    }
}

// DeleteUser handles DELETE /users/{id} request
func (h *UserHandler) DeleteUser() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        vars := mux.Vars(r)
        id, err := strconv.Atoi(vars["id"])
        if err != nil {
            http.Error(w, "Invalid user ID", http.StatusBadRequest)
            return
        }

        result, err := h.db.Exec("DELETE FROM users WHERE id = $1", id)
        if err != nil {
            http.Error(w, "Error deleting user", http.StatusInternalServerError)
            return
        }

        rowsAffected, err := result.RowsAffected()
        if err != nil || rowsAffected == 0 {
            http.Error(w, "User not found", http.StatusNotFound)
            return
        }

        w.WriteHeader(http.StatusNoContent)
    }
}