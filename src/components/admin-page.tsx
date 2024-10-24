import { useState, FormEvent,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from '../utils/api';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  userType: "student" | "teacher";
}

export function AdminPageComponent() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, username: "john_doe",email: "test@gmail.com", password: "********", userType: "student" },
    {
      id: 2,
      username: "jane_smith",
      email: "test@gmail.com",
      password: "********",
      userType: "teacher",
    },
  ]);
  const toast = useToast();
  const [newUser, setNewUser] = useState<{ username: string; email: string,password: string; userType: "student" | "teacher" }>({ username: "", email:"", password: "", userType: "student" });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');
  const addUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newUser.username && newUser.password) {
      setUsers([...users, { id: users.length + 1, ...newUser,email:"test", userType: "student" || "teacher" || "admin" }]);
      setNewUser({ username: "", email:"",password: "", userType: "student" });
      HandleCreateSubmit(e);
      toast.toast({
        title: "User Added",
        description: `${newUser.username} has been added successfully.`,
      });
    }
  };

  const HandleCreateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post("/admin/teacher", newUser);
      if (response.data.token) {
        setMessage('Account created!');
        navigate('/'); // Redirect to dashboard
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message || 'An error occurred');
      } else {
        setMessage('An unexpected error occurred');
      }
    }
  };
  const editUser = async () => {
    if (!editingUser) return;

    try {
      const response = await api.put(`/admin/teacher/${editingUser.id}`, editingUser);
      if (response.status === 200) {
        setUsers(users.map(user => (user.id === editingUser.id ? editingUser : user)));
        setEditingUser(null); // Clear editing state
        toast.toast({ title: "User Updated", description: `${editingUser.username}'s information has been updated.` });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.toast({ title: "Error", description: "Failed to update user." });
    }
  };
  const startEditing = (user: User) => {
    setEditingUser(user);
  };


  
  const getTeachers = async () => {
    try {
      const response = await api.get('/teachers');
      const teacherData: User[] = response.data.map((teacher: any) => ({
        id: teacher._id, // Use the ObjectId as the user id
        username: teacher.username,
        email: teacher.email,
        password: teacher.password, // Consider handling password hashing if needed
        userType: teacher.accountType as "student" | "teacher", // Ensure this maps correctly
      }));
  
      // Update the users state with the mapped data
      setUsers(teacherData);
  
      // Optionally, set newUser to the first teacher's data
      if (teacherData.length > 0) {
        const firstTeacher = teacherData[0];
        setNewUser({
          username: firstTeacher.username,
          email: firstTeacher.email,
          password: "", // Set to empty string or handle as needed
          userType: firstTeacher.userType,
        });
      }
    } catch (err) {
      console.error('Error getting teachers:', err);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const response = await api.delete(`/admin/teacher/${id}`);
      if (response.status === 200) {
        // Update local state to remove the deleted user
        setUsers(users.filter(user => user.id !== id));
        toast.toast({ title: "User Deleted", description: "The user has been deleted successfully.", variant: "destructive" });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.toast({ title: "Error", description: "Failed to delete user." });
    }
  };
  
  
  
  useEffect(() => {
    if (userType !== 'admin') {
      // Redirect non-admin users to a different page (e.g., home page)
      navigate('/');
    } else {
      getTeachers();
    }
  }, [userType, navigate]);
  if (userType !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-[400px] bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader className="bg-red-100">
            <CardTitle className="text-2xl font-bold text-red-800 flex items-center justify-center">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p className="text-gray-700 mb-4">You do not have permission to view this page.</p>
            <Button
              onClick={() => navigate('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen ">
      <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader className="bg-gradient-to-r from-[rgb(223,235,217)] to-[rgb(243,255,237)] rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
            <Users className="mr-2 text-[rgb(203,215,197)]" />
            Admin Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={addUser} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <UserPlus className="mr-2 text-[rgb(203,215,197)]" />
              Add New User
            </h2>
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                required
                className="bg-[rgb(233,245,227)] border-[rgb(203,215,197)] focus:border-[rgb(183,195,177)] focus:ring-[rgb(183,195,177)]"
              ></Input>
              <Input
                type="text"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
                className="bg-[rgb(233,245,227)] border-[rgb(203,215,197)] focus:border-[rgb(183,195,177)] focus:ring-[rgb(183,195,177)]"
              />
              <Input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
                className="bg-[rgb(233,245,227)] border-[rgb(203,215,197)] focus:border-[rgb(183,195,177)] focus:ring-[rgb(183,195,177)]"
              />
              {/* User type dropdown */}
              <select
                value={newUser.userType}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    userType: e.target.value as "student" | "teacher",
                  })
                }
                className="bg-[rgb(233,245,227)] border-[rgb(203,215,197)] focus:border-[rgb(183,195,177)] focus:ring-[rgb(183,195,177)]"
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <p>{message}</p>
              </select>
              <Button
                type="submit"
                className="bg-[rgb(243,152,78)] hover:bg-[rgb(235,195,0)] text-gray-800"
              >
                Add User
              </Button>
            </div>
          </form>

          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <Users className="mr-2 text-[rgb(203,215,197)]" />
            Manage Users
          </h2>
          <Button
                className="bg-[rgb(243,152,78)] hover:bg-[rgb(235,195,0)] text-gray-800" onClick={getTeachers}
              >Refresh</Button>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[rgb(223,235,217)] to-[rgb(243,255,237)]">
                  <TableHead className="text-gray-700">Username</TableHead>
                  <TableHead className="text-gray-700">Password</TableHead>
                  <TableHead className="text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-[rgb(233,245,227)]"
                  >
                    <TableCell>
                      {editingUser?.id === user.id ? (
                        <Input
                          value={editingUser.username}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              username: e.target.value,
                            })
                          }
                          className="bg-[rgb(233,245,227)] border-[rgb(203,215,197)] focus:border-[rgb(183,195,177)] focus:ring-[rgb(183,195,177)]"
                        />
                      ) : (
                        user.username
                      )}
                    </TableCell>
                    <TableCell>
                      {editingUser?.id === user.id ? (
                        <Input
                          type="password"
                          value={editingUser.password}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              password: e.target.value,
                            })
                          }
                          className="bg-[rgb(233,245,227)] border-[rgb(203,215,197)] focus:border-[rgb(183,195,177)] focus:ring-[rgb(183,195,177)]"
                        />
                      ) : (
                        "********"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingUser?.id === user.id ? (
                        <Button
                          onClick={editUser}
                          className="bg-[rgb(243,152,73)] hover:bg-[rgb(235,195,0)] text-gray-800 mr-2"
                        >
                          Save
                        </Button>
                      ) : (
                        <Button
                          onClick={() => startEditing(user)}
                          className="bg-[rgb(243,152,73)] hover:bg-[rgb(235,195,0)] text-gray-800 mr-2"
                        >
                          <Edit2 className="w-4 h-4 mr-1" /> Edit
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-400 hover:bg-red-500 text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
