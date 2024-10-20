'use client';

import React, { useEffect, useState } from 'react'
import { ArrowUpRight, Trash } from 'lucide-react';
import { Inter } from "next/font/google";
import { PinataSDK } from "pinata";
import Link from 'next/link';
import Loader from './Loader';
import { createClient } from "../utils/supabase/client";

const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
  });

const inter = Inter({ subsets: ["latin"] });

export default function List() {

  const [files,setFiles] = useState([]);
  const [searchText,setSearchText] = useState("");
  const [isLoading,setIsLoading] = useState(true);
  const [fileFound,setFileFound] = useState(false);
  const supabase = createClient();

  useEffect(() => {

    async function getFiles() {

        const { data: { user } } = await supabase.auth.getUser();

        if(user) {

            const filedata = await pinata
            .listFiles()
            .keyValue("email", user.email)
            .pageLimit(4);
          
            // Set the files state with the files we have found.
            if(filedata) {
                console.log("All files : ", filedata); 
                setFiles(filedata);
                setIsLoading(false);
            }
        }
    }

    getFiles();
        
  },[]);

  useEffect(() => {

    async function searchFile() {

        const { data: { user } } = await supabase.auth.getUser();

        const filedata = await pinata.listFiles().keyValue("email", user.email).pageLimit(4).name(searchText); 

        // If the file that we are searching does not exist then we set the fileFound to false.
        if(filedata.length == 0){
            setFileFound(false);
        }
           
        // If the file that we are searching exists then we set the fileFound state to true and also set the Files with file that we found.
        else{
            setFiles(filedata);
            setFileFound(true);
        }
    }

    searchFile();

  },[searchText])


  // After clicking the trash button, the hash of the file to be deleted is passed to this function
  async function deleteFile(fileHash){

    // We use the hash of the file to be deleted to filter the files array to see the file being deleted in realtime. 
    const updatedFilesList = files.filter((f) => f.ipfs_pin_hash !== fileHash);
    setFiles(updatedFilesList);
     
    // Similarly, we delete(unpin) the file from the IPFS.
    const response = await pinata.unpin([fileHash])

    if(response) {
        console.log("Response : ",response);
        console.log("File Deleted");
    }
  }

  return (

    <>

        {
            isLoading ? 

                // When we visit the /Files route, it takes a couple seconds to retrieve the data. While it is fetching the data, a loader is rendered.
                <div className='h-[400px] flex justify-center items-center text-white font-semibold text-xl'><Loader/></div>
            
            :

                (
                    files.length != 0 ?
                    
                    // if some files are uploaded then we render the heading "All files" and a searchbar to search files.
                    <div className='w-full max-sm:pb-12 flex flex-col items-center mt-5'>
        
                        <div className={`${inter.className} w-full sm:w-[40%] bg-white px-6 py-3 mb-8 border rounded-xl`}>
                            <input type="text" placeholder='Search for files...'  className='h-[20px] bg-white outline-none' onChange={(e) => setSearchText(e.target.value)} value={searchText}/>
                        </div>
        
                        {
                            // If the file we are searching for exists then we render the below component
                            fileFound ? 

                                <div className='bg-[#c2c3ff] rounded-xl py-2 w-full sm:w-[40%] flex flex-col items-center'>
            
                                    {
                                        files.map((f,index) => (
                
                                            <div className={`w-full flex justify-between items-center py-3 px-4 ${index == files.length - 1 ? 'border-none' : 'border-b border-white'}`} key={f.id}>
                
                                                {/* Here, target='_blank' opens the link on a new tab instead of opening it on the same tab*/}
                                                <Link href={`https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${f.ipfs_pin_hash}`} className='w-[65%] underline-white' target='_blank'>
                                                    <p className='text-white w-full overflow-hidden text-ellipsis text-nowrap'>{f.metadata.name}</p>
                                                </Link>
                    
                                                <div className='flex gap-4'>

                                                    <div className='px-2 py-2 bg-[#ffecd1] rounded-md font-medium'>
                                                        <Link href={`https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${f.ipfs_pin_hash}`} target='_blank'>
                                                            <ArrowUpRight width={20} height={20}/>
                                                        </Link>
                                                    </div>
                
                                                    <button className='px-2 py-2 bg-black text-white rounded-md font-medium' onClick={() => deleteFile(f.ipfs_pin_hash)}><Trash width={20} height={20}/></button>
                                                    
                                                </div>
                                                    
                                            </div>
                                        ))
                                    }
            
                                </div>
                            
                            :
                            
                            // If the file we are searching for does not exist then we just render "File not Found"
                            <p className='pt-16 text-lg flex justify-center'>File not found</p>
                        } 
        
                    </div>
        
                    :
                    
                    // If there are no files uploaded yet then we render "No files Uploaded". 
                    <p className='text-[25px] sm:text-lg w-full h-[250px] flex justify-center items-center'>No Files Uploaded</p>
                )
        }    

    </>
  )
}
