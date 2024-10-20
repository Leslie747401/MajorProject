import List from "../Components/List"
import Navbar from "../Components/Navbar";
import UploadCard from "../Components/UploadCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"


export default function Home() {
  return (
    <div className="px-5 sm:px-16">

      <Navbar/>
        
      <Tabs defaultValue="uploadFile" className="w-full">
          
        <div className="flex justify-center pb-5">
          <TabsList >
            <TabsTrigger value="uploadFile">Upload File</TabsTrigger>
            <TabsTrigger value="allFiles">All Files</TabsTrigger>
          </TabsList>
        </div>
          
        <TabsContent value="uploadFile">
          <UploadCard/>
        </TabsContent>

        <TabsContent value="allFiles">
          <List/>
        </TabsContent>
        
      </Tabs>

    </div>
  );
}
