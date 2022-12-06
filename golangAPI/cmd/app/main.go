package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Appointment struct {
	ID              uuid.UUID `json:"id"`
	AppointmentDate string    `json:"appointmentDate"`
	Email           string    `json:"email"`
	Name            string    `json:"name"`
}

var appointments = []Appointment{}

func main() {
	router := gin.Default()

	//Endpoints
	router.GET("/appointments", getAppointments)
	// router.GET("/appointment/:id", getAppointmentByID)
	router.POST("/appointments", createAppointment)
	router.DELETE("/appointments/:id", deleteAppointmentByID)

	router.Run("localhost:3001")
}

func getAppointments(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, appointments)
}

func createAppointment(c *gin.Context) {
	//create appointment
	id := uuid.New()
	var appointment Appointment
	// appointment := &Appointment{
	// 	ID:              id,
	// 	AppointmentDate: c.Param("appointmentDate"),
	// 	Email:           c.Param("email"),
	// 	Name:            c.Param("name"),
	// }
	err := c.BindJSON(&appointment)
	if err != nil {
		log.Fatal(err)
	}
	appointment.ID = id

	appointments = append(appointments, appointment)

	c.IndentedJSON(http.StatusOK, appointment)
}

func deleteAppointmentByID(c *gin.Context) {
	idString := c.Param("id")
	id := uuid.MustParse(idString)

	for ind, app := range appointments {
		if app.ID == id {
			appointments = append(appointments[:ind], appointments[ind+1:]...)
			c.IndentedJSON(http.StatusOK, app.ID)
			return
		}
	}
	c.IndentedJSON(http.StatusBadRequest, "Appointment could not be deleted")
}

// func getAppointmentByID(c *gin.Context) {
// 	c.IndentedJSON(http.StatusOK)
// }
