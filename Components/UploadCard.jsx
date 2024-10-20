'use client'

import { Upload } from 'lucide-react'
import { Inter } from "next/font/google";
import { useState } from 'react';
import { Check } from 'lucide-react';
import { X } from 'lucide-react';
import { PinataSDK } from "pinata";
import Loader from './Loader';
import Image from 'next/image';
import ImageIcon from '../public/image.png'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../Components/ui/alert-dialog'
import { createClient } from '../utils/supabase/client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
});

const inter = Inter({ subsets: ["latin"] });

export default function UploadCard() {

  const [file,setFile] = useState(null);
  const [fileName,setFileName] = useState("");
  const [isUploading,setIsUploading] = useState(false);
  const [fileLink,setFileLink] = useState("");
  const [fileStatus,setFileStatus] = useState("Upload Pending");
  const supabase = createClient();

  const handleUploadClick = () => {
    const upload_image = document.querySelector('.uploadImage');
    upload_image.click();
  }
  
  const handleFile = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setFileName(file.name);
    console.log(file.name);
  }

  const uploadFile = async () => {

    setIsUploading(true);

    const { data: { user } } = await supabase.auth.getUser();

      // if the file is uploaded to IPFS and the user is authenticated then we can update the required states to share the file and we can store the email id of the person with file in the IPFS.

    if(user){

      const upload = await pinata.upload.file(file).addMetadata({
        keyValues: {
          email : user.email
        }
      });

      if(upload){
        setIsUploading(false)
        setFileStatus("Uploaded");
        setFileLink(`https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${upload.IpfsHash}`);
      }
    }

    // If the user is not logged in then we can update the required states to share the file and we will only store the file in the IPFS. 

    else{
      const upload = await pinata.upload.file(file);

      if(upload) {
        setIsUploading(false)
        setFileStatus("Uploaded");
        setFileLink(`https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${upload.IpfsHash}`);
      }
    }
  }

    return (
    <div className={`${inter.className} w-full flex flex-col justify-center items-center max-sm:px-5`}>

        <div className='max-sm:w-full p-8 bg-[#d4d5fc] rounded-lg flex flex-col gap-6 border mb-8'>

            {/* <p className='flex justify-start w-full font-medium text-xl text-white'>Upload File</p> */}

            <input type="file" className='hidden uploadImage' accept='image/* .pdf' onChange={handleFile} disabled={fileName} required/>

            <div className='w-full sm:w-[350px] h-[250px] rounded-xl flex flex-col justify-center items-center gap-4 cursor-pointer relative border border-[#838383] bg-slate-100 border-dashed' onClick={handleUploadClick}>

              {
                fileName ? 
                
                  <>
                    <div className='sm:w-[75%] px-4 py-2 rounded-xl border border-[#d0d0d0] flex gap-2 items-center'>
                      <Image
                        src={ImageIcon}
                        width={25}
                        height={25}
                        alt='image_logo'
                      />
                      <p className='w-[120px] sm:w-full overflow-hidden whitespace-nowrap text-ellipsis'>{fileName}</p>
                      <Check width={22} height={22} className='pt-1'/>
                    </div>

                    <div className='w-8 h-8 absolute top-4 right-4 rounded-full cursor-pointer bg-black flex justify-center items-center ' onClick={() => {setFileName(false); setFile(null); setFileStatus("Upload Pending")}}>
                      <X className='text-white'/>
                    </div>
                  </>
                
                :     
                  <>
                    <Upload/>
                    <p className='text-[#575757] text-center'>Drag and drop or <br className='sm:hidden'/>
                    <span className='text-blue-500'>browse files</span>
                    </p>
                  </>
              }

            </div>

            <div className='flex justify-between'>

                    {
                      file == null ?

                      <AlertDialog>
                        <AlertDialogTrigger className='bg-black text-white text-lg font-medium w-full py-2 rounded-lg flex gap-2 justify-center items-center'>Upload</AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Missing File</AlertDialogTitle>
                            <AlertDialogDescription>
                              It looks like you did not select a file. Please choose a file to upload.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogAction>Got it</AlertDialogAction>
                          </AlertDialogFooter> 
                        </AlertDialogContent>
                      </AlertDialog>

                    :

                      (
                        isUploading ?

                          <div className='bg-black text-white text-lg font-medium w-full py-2 rounded-lg flex justify-center'>
                            <Loader/>
                          </div> 

                        :

                          (
                            fileStatus == "Upload Pending" ?

                              <button className={`bg-black text-white text-lg font-medium w-full py-2 rounded-lg flex gap-2 justify-center items-center ${isUploading && 'cursor-not-allowed'}`} onClick={uploadFile} disabled={isUploading}>
                                <p>Upload</p>
                              </button>

                            :

                              <button className={`bg-black text-white text-lg font-medium w-full py-2 rounded-lg flex gap-2 justify-center items-center ${fileStatus == 'Uploaded' && 'cursor-not-allowed' }`} onClick={uploadFile} disabled={fileStatus=='Uploaded'}>
                                <Check width={22} height={22} className='pt-1'/>
                                <p>Uploaded</p>
                              </button>
                            
                          )
                      )

                    }
                  
            </div>

        </div>

        {
          fileStatus == 'Uploaded' &&

            <div className='flex gap-2 items-center px-4 py-2 border border-[#d6d6d6] rounded-full hover:bg-slate-100 mb-4'>
              <Link href={fileLink} target='_blank'>Click to view the image</Link>
              <ArrowUpRight width={15} height={15}/>
            </div>
        }

    </div>
  )
}
