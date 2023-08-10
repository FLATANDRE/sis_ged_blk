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
import apiDocMetadata from "@/api_sis_ged/api_doc_metadata/metadata";
import { getEthAccounts } from "../auth/authWallet";
import { downloadFileFromIpfs } from "@/ipfs_mgmt/downloadFile";
import { getIpfsClusterInstance } from "@/ipfs_mgmt/ipfs";

export function DocumentHome() {  
  const [filesRef, setFilesRef] = useState([]);
  const accounts = getEthAccounts();
  const userId =  accounts[0];
  let isFilesRefLoaded = false;
  const [filesForDelete, setFilesForDelete] = useState([]);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if(!isFilesRefLoaded) {
      getFiles();
    }
  }, []);

  async function getFiles() {
    isFilesRefLoaded = true;
    apiDocMetadata
      .get(`/documentMetadata/user/${userId}/documents`)
      .then((response) => setFilesRef(response.data))
      .catch((err) => console.error(err));
  }

  const selectItemForDelete = (evt,cid) => {
    let filesAux = [...filesForDelete];
    if (evt.target.checked) {
      filesAux.push(cid);
    } else {
      filesAux.pop(cid);
    }
    setFilesForDelete(filesAux);
  }

  const unpinDocs = async () => {
    if (filesForDelete.length > 0) {
      const ipfs = getIpfsClusterInstance();

      for (const fileCid of filesForDelete) {      
        await ipfs.unpin(fileCid);
        await apiDocMetadata.delete(`/documentMetadata/${fileCid}`);
      }
      
      setModalMessage('Arquivo(s) foram removidos com sucesso.');
      setShowModal(true);
      await getFiles();
    }
  }

  return (
    <>
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
                <MenuItem onClick={unpinDocs}>Excluir {filesForDelete.length > 1 ? "documentos" : "documento" }</MenuItem>                
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["","CID","Nome do arquivo", "Data", "Info. do documento", "Versão"].map(
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
                  ({docName,docCID,docInfo,date,version},index) => {
                    const className = `py-3 px-5 ${
                      index === filesRef.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={index}>
                        <td className={className} >
                          <input type="checkbox" onClick={(e) => selectItemForDelete(e,docCID)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                        </td>

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
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal transition-all hover:text-blue-500 hover:opacity-100"
                            >
                              <a className="underline cursor-pointer" onClick={() => downloadFileFromIpfs(docCID)}>{docName}</a>  
                            </Typography>                        
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
                            {docInfo} 
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


    {showModal ? (
          <>
          <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
              <div className="relative w-auto my-6 mx-auto max-w-sm">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                      Gestão de Arquivo
                  </h3>
                  <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                  >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                      </span>
                  </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                      {modalMessage}                            
                  </p>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                  >
                      Fechar
                  </button>                        
                  </div>
              </div>
              </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
      ) : null}
    </>
  );
}

export default DocumentHome;