import { createContext, useState, useEffect } from 'react';

// Create the context
const UserContext = createContext(null);

// UserProvider component
export const UserProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(null);

	// Load user from localStorage on app start
	useEffect(() => {
		const savedUser = localStorage.getItem('authenticatedUser');
		if (savedUser) {
			try {
				setAuthUser(JSON.parse(savedUser));
			} catch (error) {
				console.error('Error parsing saved user data:', error);
				localStorage.removeItem('authenticatedUser');
			}
		}
	}, []);

	// Save user to localStorage whenever authUser changes
	useEffect(() => {
		if (authUser) {
			localStorage.setItem('authenticatedUser', JSON.stringify(authUser));
		} else {
			localStorage.removeItem('authenticatedUser');
		}
	}, [authUser]);

	// Sign in method
	const signIn = async (credentials) => {
		const { emailAddress, password } = credentials;
		
		try {
			const response = await fetch('http://localhost:5000/api/users', {
				method: 'GET',
				headers: {
					'Authorization': `Basic ${btoa(`${emailAddress}:${password}`)}`,
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				const user = await response.json();
				const userWithCredentials = {
					...user,
					emailAddress,
					password
				};
				setAuthUser(userWithCredentials);
				return userWithCredentials;
			} else if (response.status === 401) {
				throw new Error('Invalid credentials');
			} else {
				throw new Error('Sign in failed');
			}
		} catch (error) {
			console.error('Sign in error:', error);
			throw error;
		}
	};

	// Sign out method
	const signOut = () => {
		setAuthUser(null);
	};

	// Sign up method
	const signUp = async (userData) => {
		try {
			const response = await fetch('http://localhost:5000/api/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userData),
			});

			if (response.ok) {
				return await signIn({
					emailAddress: userData.emailAddress,
					password: userData.password
				});
			} else if (response.status === 400) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Validation failed');
			} else {
				throw new Error('Sign up failed');
			}
		} catch (error) {
			console.error('Sign up error:', error);
			throw error;
		}
	};

	// Helper method to get auth headers for API calls
	const getAuthHeaders = () => {
		if (authUser && authUser.emailAddress && authUser.password) {
			return {
				'Authorization': `Basic ${btoa(`${authUser.emailAddress}:${authUser.password}`)}`,
				'Content-Type': 'application/json',
			};
		}
		return {
			'Content-Type': 'application/json',
		};
	};

	const value = {
		authUser,
		signIn,
		signOut,
		signUp,
		getAuthHeaders
	};

	return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	);
};

export default UserContext;
