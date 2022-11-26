import './App.css';
import { Paper, TextField, Button, Typography } from '@mui/material';
import { DeleteOutline } from "@mui/icons-material";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import icon from './icon.jpg';
import { useState, useEffect } from 'react';
import axios from 'axios';
import url from './baseUrl';

function App() {
  const [links, setLinks] = useState("");
  const [duplicateLinks, setDuplicateLinks] = useState([]);
  const [data, setData] = useState([]);

  function saveLinks(data) {
    axios.post(`${url}/api`, { links: data })
      .then(res => {
        console.log(res);
        if (res.data.statusCode === 200) {
          toast.success(res.data.message);
          setLinks([]);
          setDuplicateLinks(res.data.duplicateLinks);
        } else {
          toast.info(res.data.message);
          setDuplicateLinks(res.data.duplicateLinks);
        }
      }).catch(err => console.log(err));
  }

  function fetchDuplicateLinks(data) {
    axios.post(`${url}/api/check`, { links: data })
      .then(res => {
        console.log(res);
        if (res.data.statusCode === 200) {
          setDuplicateLinks(res.data.duplicateLinks);
          toast.success(res.data.message);
        } else {
          setDuplicateLinks(res.data.duplicateLinks);
          toast.info(res.data.message);
        }
      }).catch(err => console.log(err));
  }

  const duplicateLinksHandler = () => {
    // if links empty, return
    if (links == "") return toast.error("Please enter links");

    // filters only tiktok links
    let data = links.split("\n");

    // remove query paramaters
    data = data.map((item) => {
      return item.split("?")[0];
    });

    // remove empty lines
    data = data.filter((item) => {
      return item !== "";
    });

    // string does not contain "tiktok.com"
    data = data.filter((item) => {
      if (item.includes("tiktok.com")) {
        return item;
      }
    });

    // remove duplicate links
    data = [...new Set(data)];
    // setLinks(data.join("\n"));

    let strToArray = data.map(link => {
      return { url: link };
    })

    if (strToArray.length === 0) {
      toast.error("No valid links found");
      return;
    }

    // check if links already exist in db
    fetchDuplicateLinks(strToArray);
  }



  // string to array
  const URLProcessing = (str) => {
    // if links empty, return
    if (str == "") return toast.error("Please enter links");

    let data = str.split("\n");

    // remove query paramaters
    data = data.map((item) => {
      return item.split("?")[0];
    });

    // remove empty lines
    data = data.filter((item) => {
      return item !== "";
    });

    // string does not contain "tiktok.com"
    data = data.filter((item) => {
      if (item.includes("tiktok.com")) {
        return item;
      }
    });

    // remove duplicate links
    data = [...new Set(data)];
    // console.log("data:", data);

    let strToArray = data.map(link => {
      return { url: link };
    })

    if (strToArray.length === 0) {
      toast.error("No valid links found");
      return;
    }

    setData(strToArray);
    console.log({ strToArray });
    saveLinks(strToArray);

  }

  const submitHandler = (e) => {
    e.preventDefault();
    URLProcessing(links);

  }

  const filterLinks = () => {
    // if links empty, return
    if (links == "") return toast.error("Please enter links");

    // filters only tiktok links
    let data = links.split("\n");

    // remove query paramaters
    data = data.map((item) => {
      return item.split("?")[0];
    });

    // remove empty lines
    data = data.filter((item) => {
      return item !== "";
    });

    // string does not contain "tiktok.com"
    data = data.filter((item) => {
      if (item.includes("tiktok.com")) {
        return item;
      }
    });

    // remove duplicate links
    data = [...new Set(data)];
    setLinks(data.join("\n"));
  }


  return (
    <div className="App flex-1 m-4">
      <div className='p-5 flex justify-center'>
        <Paper elevation={3} className='py-10 w-[75%]'>
          <div className='flex flex-col'>
            <div className='flex justify-center'>
              <img src={icon} alt="Logo" className="w-2/4 h-2/4 rounded-md" />
            </div>

            <div className="flex-1 px-10 py-5">
              <div className='flex justify-between items-center space-x-4 pb-4'>
                <TextField
                  fullWidth
                  label="URLs / Links"
                  variant="outlined"
                  multiline
                  rows={10}
                  value={links}
                  onChange={(e) => setLinks(e.target.value)}
                />
                <div className='flex flex-col items-center space-y-5 '>
                  <Button color='info' variant="contained" size='large' className='mb-8 w-40'
                    onClick={filterLinks}>
                    Filter Links
                  </Button>
                  <Button color='info' variant="contained" size='large' className='mb-8 w-40'
                    onClick={duplicateLinksHandler}>
                    Check in DB
                  </Button>
                </div>
              </div>
            </div>
            <div className='flex justify-center my-4'>
              <Button color='success' variant="contained" size='large' className='mb-8'
                onClick={submitHandler}>
                Save Links
              </Button>
            </div>

            {duplicateLinks?.length > 0 && (
              <div className='flex flex-col  pt-4 border mx-8'>
                <span className='text-red-700 justify-start text-xl font-semibold'>{`Duplicate Links: ${duplicateLinks?.length}`}</span>
                <div className='flex flex-col px-8'>
                  {duplicateLinks.map((item, index) => (
                    <div className='flex justify-between items-center space-x-4 pb-2' key={index}>
                      <p>{item.url}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </Paper>
      </div>
      <ToastContainer />
    </div >
  );
}

export default App;
