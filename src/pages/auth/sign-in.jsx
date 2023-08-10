import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import {connectWallet, getEthAccounts} from "./authWallet";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function SignIn() {
  const [account, setAccount] = useState([]);
  const navigate = useNavigate();
  const isAccountLoaded = false;
  const [isLoged, setIsLoged] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const getAccount = async () => {  
    setIsLoged(await connectWallet());  
    setAccount(getEthAccounts());
  }

  const login = async () => {  
    await connectWallet();
    const accountCompare = getEthAccounts();
    if (account[0] === accountCompare[0] && isLoged) {
      navigate("/dashboard/home");
    } else {
      setModalMessage(`A conta de usuário ${account[0]} é  diferente da conta logada na Metamask ${accountCompare[0]}. Realize o refresh da página para atualizar a conta utilizada.`);
      setShowModal(true);
    }
  }

  useEffect(() => {
    if(!isAccountLoaded) {
      getAccount();
    }
  }, []);

  return (
    <>
      <img
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Acessar o Sis GED
            </Typography>
          </CardHeader>
          <CardBody className="justify-center items-center flex flex-col gap-4">
            <label for="userAccount" class="block text-sm font-medium leading-6 text-gray-900">Conta de usuário</label>                            
            <p>{account.length > 0 ? account : "Realize o login em uma conta na Metamask"}</p>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={login} disabled={!isLoged}  fullWidth>
              Entrar
            </Button>              
          </CardFooter>
        </Card>
      </div>

      {showModal ? (
          <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Sis GED com Blockchain
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

export default SignIn;
