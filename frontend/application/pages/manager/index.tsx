import 'regenerator-runtime/runtime';
import * as React from 'react';
import { useSelector } from 'react-redux'

import store from './store';

import Products from './ProductsLicenses/';
import UsersLicenses from './UsersLicenses/';

import { createApp } from '../../utils/createApp';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import UsersList from './UsersLicenses/users/UsersList';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}


const App: React.FC<any> = () => {
	const currentProductLicenseId = useSelector((state: any) => state.productsLicenses.current);
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};
	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
					<Tab label="Products" {...a11yProps(0)} />
					<Tab label="Clients" {...a11yProps(1)} />
				</Tabs>
			</Box>
			<CustomTabPanel value={value} index={0}>
				<div className="row">
					<div className="col-md-12 mb-4">
						<div className="d-flex">
							<div className="col-md-4 mb-4">
								<Products />
							</div>

							<div className="col-md-8 mb-4">
								<UsersLicenses licenseId={currentProductLicenseId} />
							</div>
						</div>
					</div>
				</div>
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				<div className="col-md-8 mb-4">
					<UsersList />
				</div>
			</CustomTabPanel>
		</Box>

	);
}


createApp(App, store);
