// Create a Navbar component with:
// Options: Search for Books and Login/Signup.
// Use React Router to render the search input field when the user selects Search for Books.
// A modal for Login/Signup with a toggle between forms.
// Contains Search for Books, Login/Signup, and Logout options.
// Shows Saved Books option only when logged in.

// const handleLogin = async (email, password) => {
//     const { data } = await client.mutate({
//       mutation: LOGIN_USER,
//       variables: { email, password },
//     });
//     localStorage.setItem('token', data.login.token);
//     setUser(data.login.user); // Store user in state
//   };

// const handleLogout = () => {
//     localStorage.removeItem('token');
//     setUser(null); // Reset user state
//   };