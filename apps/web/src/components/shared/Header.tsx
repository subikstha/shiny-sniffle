import { Layout, Flex, Menu, Dropdown, Avatar } from 'antd'
import useAuth from '../../hooks/useAuth';
import { Link } from '@tanstack/react-router';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { logout } from '../../api/auth';
const { Header } = Layout

const userItems = [
  {
    key: 'Profile',
    label: 'profile'
  },
  {
    key: 'logout',
    label: 'Logout'
  }
]


const AppHeader = () => {
  const queryClient = new QueryClient()
  const { isAuthenticated, isLoading, user } = useAuth();
  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      console.log("Logout success");
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });
  function handleClick({ key }: { key: string }) {
    switch (key) {
      case 'profile':
        console.log('user clicked on profile')
        break;

      case 'logout':
        console.log('User clicked on logout')
        logoutMutation.mutate()
        break;
    }
  }


  return <Header>
    <Flex justify="space-between" align="center">
      <div>My App</div>

      <Menu
        mode="horizontal"
        items={[
          { key: "home", label: "Home" },
          { key: "tasks", label: "Tasks" },
        ]}
      />
      {isAuthenticated ? (<Dropdown className="cursor-pointer" menu={{
        items: userItems,
        onClick: handleClick
      }}>
        <Avatar>{user?.email.split('')[0]}</Avatar>
      </Dropdown>) : (<Link to="/login">Login</Link>)}

    </Flex>
  </Header>;
};

export default AppHeader;
