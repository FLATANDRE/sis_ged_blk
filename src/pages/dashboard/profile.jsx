import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { ProfileInfoCard } from "@/widgets/cards";
import { useEffect, useState } from "react";
import apiUserProfile from "@/api_sis_ged/api_user_profile/profile";
import { getEthAccounts } from "../auth/authWallet";

export function Profile() {
  const [isProfileLoaded, setProfileLoaded] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [userTransanctions,setUserTransactions] = useState([]);

  const account = getEthAccounts();

  useEffect( () => {
    if(!isProfileLoaded) {
      getProfile();
    }
  }, []);

  const getProfile = async () => {
    setProfileLoaded(true);   
    apiUserProfile
      .get(`/profile/${account[0]}`)
      .then((response) => {
        setUserProfile(response.data);             
      })
      .catch((err) => console.error(err));  
  }

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url(https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src="/img/bruce-mars.jpeg"
                alt="bruce-mars"
                size="xl"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {userProfile.name}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  Usuário do sistema
                </Typography>
              </div>
            </div>
            <div className="w-96">
              <Tabs value="app">
                <TabsHeader>
                  <Tab value="app">
                    <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    App
                  </Tab>
                  <Tab value="message">
                    <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                    Message
                  </Tab>
                  <Tab value="settings">
                    <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Settings
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">
            <ProfileInfoCard
              title="Informações"
              description={userProfile.userInfo}
              details={{
                "Nome": userProfile.name,
                "Conta Metamask": userProfile.account,
                email: userProfile.email,
                "localização": "Brasil",                
              }}             
            />           
          </div>
                
          
        </CardBody>        
      </Card>
    </>
  );
}

export default Profile;
