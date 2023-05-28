import React, { useState, useEffect, useRef } from "react";
import { load, identify } from "../Modules/Tensorflow";
import { storage, database } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as databaseRef, set, child, get, push, onValue } from "firebase/database";
import { v4 } from "uuid";

import {
  createStyles,
  Center,
  Container,
  Button,
  Group,
  Paper,
  Text,
  FileButton,
  Image,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  wrapper: {
    // height: "30vh",
  },
}));

const Uploader = () => {
  const { classes } = useStyles();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loaded, setLoaded] = useState(false);
  const [predicted, setPredicted] = useState(false);

  //get image url from firebase storage
  const [Url, setUrl] = useState('');

  const resetRef = useRef(null);

  const imageRef = useRef(null);

  const [recordId, setRecordId] = useState(0);
  const [data, setData] = useState({});


  // sets preview when file is uploaded
  useEffect(() => {
    let objectURL = null;

    const currentDate = new Date();
    const currentDateTimeString = currentDate.toLocaleString();

    if (file) {
      objectURL = URL.createObjectURL(file);
      setPreview(objectURL);
      runPrediction(objectURL);

      const records = [
        {
          id: recordId,
          file: file,
          location: "subang jaya",
          reportDate: currentDateTimeString,
          confidentialLevel: "99",
          repairStatus: "Under Review",
          repairCompletionDate: " N/A ",
        },
        // Add more records as needed
      ];


      const uploadAndSaveRecord = async (record) => {
        try {
          const database = getDatabase();
          const potholeRef = ref(database, "pothole");
          const onDataChange = (snapshot) => {
            if (snapshot.exists()) {
              const fetchedData = snapshot.val();
              setData({ ...fetchedData });

              // Find the largest ID number
              let largestId = 0;
              Object.keys(fetchedData).forEach((id) => {
                if (fetchedData[id].id > largestId) {
                  largestId = fetchedData[id].id;
                }
              });

              // Update the recordId state with the largest ID number
              setRecordId(largestId);
            } else {
              setData({});
              setRecordId(0);
            }
          };

          onValue(potholeRef, onDataChange);




          const { file, ...data } = record;

          const imageRef = ref(storage, `images/${file.name}_${v4()}`);
          await uploadBytes(imageRef, file);
          alert("Image uploaded successfully");

          const url = await getDownloadURL(imageRef);

          const newRecordRef = push(databaseRef(database, "pothole"));
          await set(newRecordRef, {
            Url: url,
            ...data,
          });

          alert("Data saved successfully");
        } catch (error) {
          console.error("Error uploading image:", error);
          // Handle the error appropriately
        }
      };

      // Call the uploadAndSaveRecord function for each record
      records.forEach(uploadAndSaveRecord);
    }
    return () => {
      if (objectURL) {
        URL.revokeObjectURL(objectURL);
      }
    };
  }, [file]);

  // const loadOnce = true;
  useEffect(() => {
    try {
      load().then(() => {
        setLoaded(true);
        console.log(loaded);
      });
    } catch {
      console.log("error loading model");
    }
  }, [loaded]);

  const clearFile = () => {
    console.log(file);
    console.log(preview);
    console.log(resetRef);
    setFile(null);
    setPreview(null);
    resetRef.current?.();
  };


  //location
  const successCallback = (position) => {
    console.log(position);
  };

  //location
  const errorCallback = (error) => {
    console.log(error);
  };

  //location
  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
  };

  const runPrediction = async (objectURL) => {
    if (!loaded) return;
    else {
      navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback,
        options
      );
      identify(objectURL).then(() => setPredicted(true));
    }
  };


  return (
    <>
      <Container size="lg">
        <Paper
          shadow="xs"
          radius="md"
          p="xl"
          m="xl"
          withBorder
          className={classes.wrapper}
        >
          <Center>
            <Image
              maw={500}
              fit="contain"
              mx="auto"
              // radius="md"
              alt="not found"
              src={preview}
              withPlaceholder
              width={200}
              height={200}
              ref={imageRef}
            />
          </Center>
        </Paper>
      </Container>

      <Group position="center">
        <FileButton
          //onChange={setFile}
          onChange={setFile}
          accept="image/png, image/jpeg"
          disabled={!loaded}
        >
          {(props) => <Button {...props}>Upload Image</Button>}
        </FileButton>
        <Button disabled={!file} color="red" onClick={clearFile}>
          Remove
        </Button>
      </Group>
      {file && (
        <Text size="sm" align="center" mt="sm">
          Picked file: {file.name}
        </Text>
      )}
      <p><a href={Url}> {Url} </a></p>
    </>
  );
};

export default Uploader;
