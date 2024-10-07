import { Applications } from "./assets/pages/dashboard/applications";
import { Users } from "./assets/pages/dashboard/users";
import { Dashboard } from "./assets/pages/dashboard";
import { ApplicationsAdd } from "./assets/pages/dashboard/applicationsAdd";
import { ApplicationsEdit } from "./assets/pages/dashboard/applicationsEdit";
import { UserAdd } from "./assets/pages/dashboard/usersAdd";
import { UserEdit } from "./assets/pages/dashboard/usersEdit";
import { VirtualMachine } from "./assets/pages/dashboard/virtualMachine";
import AppDetail from "./assets/pages/landingPage/appDetail";
import AuthLayout from "./assets/layouts/authenticated";
import { Navigate } from "react-router-dom";
import { VirtualMachineAdd } from "./assets/pages/dashboard/virtualMachineAdd";
import LandingPage from "./assets/pages/landingPage";
import { VirtualMachineEdit } from "./assets/pages/dashboard/virtualMachineEdit";
import { Pics } from "./assets/pages/dashboard/pics";
import { PicAdd } from "./assets/pages/dashboard/picsAdd";
import { PicEdit } from "./assets/pages/dashboard/picsEdit";
import { Group } from "./assets/pages/dashboard/group";
import { Company } from "./assets/pages/dashboard/Company";
import { GroupEdit } from "./assets/pages/dashboard/groupEdit";
import { CompanyEdit } from "./assets/pages/dashboard/CompanyEdit";
import { GroupAdd } from "./assets/pages/dashboard/groupAdd";
import { CompanyAdd } from "./assets/pages/dashboard/CompanyAdd";
import { Topology } from "./assets/pages/dashboard/topology";
import { Technology } from "./assets/pages/dashboard/technology";
import { TopologyAdd } from "./assets/pages/dashboard/topologyAdd";
import { TechnologyAdd } from "./assets/pages/dashboard/technologyAdd";
import { TopologyEdit } from "./assets/pages/dashboard/topologyEdit";
import { TechnologyEdit } from "./assets/pages/dashboard/technologyEdit";
import { ProfilePage } from "./assets/pages/dashboard/profilePage";
import { ProfileEdit } from "./assets/pages/dashboard/profileEdit";

import { Testing } from './assets/pages/dashboard/testing'


const routes = [
    {
        layout: "dashboard",
        pages: [
        {
            name: "dashboard",
            path: "/",
            element: <Dashboard />,
        },
        {
            name: "testing",
            path: "/testing",
            element: <Testing />,
        },
        {
            name: "applications",
            path: "/applications",
            element: <Applications />,
        },
        {
            name: "applications add",
            path: "/applications/add",
            element: <ApplicationsAdd />,
        },
        {
            
            name: "applications edit",
            path: `/applications/edit/:id`,
            element: <ApplicationsEdit />,
        },
        {
            name: "application detail",
            path: "/applications/detail/:id",
            element: <AppDetail />,
        },
        {
            name: "users",
            path: "/users",
            element: <Users />,
        },
        ,
        {
            name: "user add",
            path: "/users/add",
            element: <UserAdd />,
        },
        {
            
            name: "user edit",
            path: `/users/edit/:id`,
            element: <UserEdit />,
        },
        {
            name: "virtual machines",
            path: `/virtual_machines`,
            element: <VirtualMachine />,
        },
        {
            name: "virtual machines add",
            path: `/virtual_machines/add`,
            element: <VirtualMachineAdd />,
        },
        {
            name: "virtual machines edit",
            path: `/virtual_machines/edit/:id`,
            element: <VirtualMachineEdit />,
        },
        {
            name: "not found",
            path: `/*`,
            element: <Navigate to="/dashboard" replace />,
        },
        {
            name: "pics",
            path: `/pics`,
            element: <Pics />,
        },
        {
            name: "pic add",
            path: `/pics/add`,
            element: <PicAdd />,
        },
        {
            name: "pic edit",
            path: `/pics/edit/:id`,
            element: <PicEdit />,
        },
        {
            name: "profilePage",
            path: "/profilePage",
            element: <ProfilePage />,
        },
        {
            name: "profileEdit",
            path: "/profileEdit",
            element: <ProfileEdit />,
        },
        {
            name: "groups",
            path: "/groups",
            element: <Group />,
        },
        {
            name: "group add",
            path: "/groups/add",
            element: <GroupAdd />,
        },
        {
            name: "group edit",
            path: "/groups/edit/:id",
            element: <GroupEdit />,
        },
        {
            name: "companies",
            path: "/companies",
            element: <Company />,
        },
        {
            name: "companies add",
            path: "/companies/add",
            element: <CompanyAdd />,
        },
        {
            name: "companies edit",
            path: "/companies/edit/:id",
            element: <CompanyEdit />,
            },
        {
            name: "topology",
            path: "/topologies",
            element: <Topology />,
        },
        {
            name: "topology add",
            path: "/topologies/add",
            element: <TopologyAdd />,
        },
        {
            name: "topology edit",
            path: "/topologies/edit/:id",
            element: <TopologyEdit />,
        },
        {
            name: "technology",
            path: "/technologies",
            element: <Technology />,
        },
        {
            name: "technology add",
            path: "/technologies/add",
            element: <TechnologyAdd />,
        },      
        {
        name: "technology edit",
        path: "/technologies/edit/:id",
        element: <TechnologyEdit />,
        },
        ],
    },
    {
        layout: "/",
        pages: [
        {
            name: "LANDING PAGE",
            path: "/",
            element: <LandingPage />,
        },
        {
            name: "Detail App",
            path: "/application/:id",
            element: <AppDetail />,
        },
        ,
        {
            name: "not found",
            path: `/*`,
            element: <Navigate to="/dashboard" replace />,
        },
        ],
    }
];

export default routes;