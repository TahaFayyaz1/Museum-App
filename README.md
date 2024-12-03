# Museum App

This is a full-stack web application designed for museums to manage and showcase exhibits. The application provides features for image upload and validation, exhibit data management, QR code generation, and more. It is built using **React** for the frontend and **Node.js** for the backend, with **MongoDB** as the database.

## Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
   - [Frontend](#frontend)
   - [Backend](#backend)
3. [Prerequisites](#prerequisites)
4. [Getting Started](#getting-started)
   - [Clone the Repository](#clone-the-repository)
   - [Install Dependencies](#install-dependencies)
   - [Set Up Environment Variables](#set-up-environment-variables)
   - [Run the Application](#run-the-application)
5. [API Routes](#api-routes)
6. [Future Improvements](#future-improvements)
9. [Contact](#contact)

## Features

- **Image Upload and Validation**: Upload exhibit images with validation for file size and format.
- **Exhibit Management**: Add and view exhibit details.
- **QR Code Generation**: Generate unique QR codes for each exhibit, linking to detailed information.
- **Elasticsearch Integration**: Enable advanced image search functionality.
- **QR Code Scanning**: Used device camera to decode and process QR codes to retrieve exhibit details.

## Technologies Used
### Frontend
- **React**: For building a responsive and dynamic user interface.
- **Axios**: For handling API requests.
- **Tailwind CSS**: For styling the application.
- **React QR Scanner**: For scanning QR Codes.

### Backend
- **Node.js**: For handling server-side logic.
- **Express.js**: For setting up API routes.
- **Multer**: For handling file uploads.
- **MongoDB**: For storing exhibit data.
- **QR Code**: For generating QR codes.
- **Elastic Search**: For advanced image search.

## Prerequisites
Before running the application, ensure you have the following installed:
- **Node.js** (v16+)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

## Getting Started

### Clone the Repository
```
git clone https://github.com/TahaFayyaz1/Museum-App.git
cd Museum-App
```

### Install Dependencies

#### Frontend
```
cd museum-frontend  
npm install
```

#### Frontend
```
cd museum-backend  
npm install
```

### Set Up Environment Variables

Create a `.env` file in the `backend` directory and add the following environment variables:  
```
MONGO_URI=your_mongodb_connection_string
ELASTIC_USERNAME=your_elastic_username
ELASTIC_PASSWORD=your_elastic_password
```

### Run the Application

#### Elasticsearch Setup  
Ensure Elasticsearch is installed and running on its default port **9200**. You can verify it by navigating to `http://localhost:9200` in your browser or using a tool like `curl`:  
```bash  
curl -X GET "localhost:9200/"
```

#### Backend
```
cd museum-backend
node server.js
```
#### Frontend
```
cd museum-frontend  
npm start  
```

## API Routes  

The backend provides the following API routes to manage and interact with images:  

### **Base URL**: `http://localhost:5000/api/images`  

1. **Get All Images**  
   - **Endpoint**: `/`  
   - **Method**: `GET`  
   - **Description**: Retrieves all images from the database.  

2. **Upload and Save an Image**  
   - **Endpoint**: `/upload`  
   - **Method**: `POST`  
   - **Description**: Uploads an image, validates it, and saves its metadata to the database.  

3. **Generate a QR Code for an Image**  
   - **Endpoint**: `/qrcode/:id`  
   - **Method**: `GET`  
   - **Description**: Generates a QR code for the image identified by its `id`.  

4. **Search Images**  
   - **Endpoint**: `/search`  
   - **Method**: `POST`  
   - **Description**: Searches images based on a description using Elasticsearch.  

5. **Get an Image by ID**  
   - **Endpoint**: `/:id`  
   - **Method**: `GET`  
   - **Description**: Retrieves a single image by its `id` from the database.  


## Future Improvements
- Add user authentication for exhibit management.


## Contact  
For questions or feedback, please contact **Taha Fayyaz** at taha.fayyaz1@gmail.com.  

You can also find me on:  
- [GitHub](https://github.com/TahaFayyaz1)  
- [LinkedIn](https://www.linkedin.com/in/tahafayyaz) 
- Project Repository: [Museum App on GitHub](https://github.com/TahaFayyaz1/Museum-App)
