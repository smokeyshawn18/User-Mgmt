package main

import (
	"api/internal/database"
	"api/internal/handlers"
	"api/internal/middleware"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
    db, err := database.InitDB()
    if err != nil {
        log.Fatal("Error connecting to the database:", err)
    }
    defer db.Close()

    userHandler := handlers.NewUserHandler(db)
    
    router := mux.NewRouter()
    
    // API routes
    api := router.PathPrefix("/api/go").Subrouter()
    api.HandleFunc("/users", userHandler.GetUsers()).Methods("GET")
    api.HandleFunc("/users", userHandler.CreateUser()).Methods("POST")
    api.HandleFunc("/users/{id}", userHandler.GetUser()).Methods("GET")
    api.HandleFunc("/users/{id}", userHandler.UpdateUser()).Methods("PUT")
    api.HandleFunc("/users/{id}", userHandler.DeleteUser()).Methods("DELETE")

    // Add middleware
    enhancedRouter := middleware.EnableCORS(middleware.JSONContentType(router))
    
    log.Println("Server starting on :8000")
    log.Fatal(http.ListenAndServe(":8000", enhancedRouter))
}