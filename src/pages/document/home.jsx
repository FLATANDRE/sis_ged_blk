import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  CheckIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import {getAppIpfsInstance} from "@/ipfs_mgmt/ipfs";
import apiDocMetadata from "@/api_sis_ged/api_doc_metadata/metadata";

export function DocumentHome() {  
  const [filesRef, setFilesRef] = useState([]);
  const userId = 123;
  var isFilesRefLoaded = false;

  useEffect(() => {
    async function getFiles() {
      isFilesRefLoaded = true;
      apiDocMetadata
      .get(`/documentMetadata/user/${userId}/documents`)
      .then((response) => setFilesRef(response.data))
      .catch((err) => console.error(err));
    }

    if(!isFilesRefLoaded) {
      getFiles();
    }
  }, []);

  return (
    <div className="mt-12">   
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-3">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Documentos
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckIcon strokeWidth={3} className="h-4 w-4 text-blue-500" />
                <strong>{filesRef.length} Arquivo(s)</strong> no repositório 
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Incluir documento</MenuItem>                
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["CID","Nome do arquivo", "Data", "Versão"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>                
               {filesRef.map(
                  ({docName,docCID,date,version},index) => {
                    const className = `py-3 px-5 ${
                      index === filesRef.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={index}>
                        <td className={className} title={docCID.toString()}>
                          <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {docCID.toString().substring(0, 10)}...
                          </Typography>
                        </td>

                        <td className={className}>
                          {docName}                          
                        </td>

                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {date} 
                          </Typography>
                        </td>

                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {version} 
                          </Typography>
                        </td>
                      </tr>
                    );
                  }
                )}         
              </tbody>
            </table>
          </CardBody>
        </Card>
        
      </div>
    </div>
  );
}

export default DocumentHome;