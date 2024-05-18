import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader/Loader";
import FormContainer from "../components/Form/FormContainer";

import {
  useRegisterMutation,
  useUploadProfilePictureMutation,
} from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePic] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isMechanic, setIsMechanic] = useState(false);
  const [mechanicDetails, setMechanicDetails] = useState({
    specialty: "",
    experience: 0,
    shopAddress: "",
    shopName: "",
    workingHours: "",
    mechanicProfilePicture: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const [uploadProfilePicture, { isLoading: loadingUpload }] =
    useUploadProfilePictureMutation();

  const uploadProfileFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProfilePicture(formData).unwrap();
      toast.success(res.message);
      setProfilePic(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadMechanicProfileFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProfilePicture(formData).unwrap();
      toast.success(res.message);
      setMechanicDetails.mechanicProfilePicture(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({
          name,
          username,
          email,
          password,
          profilePicture,
          isMechanic,
          mechanicDetails: isMechanic ? mechanicDetails : null,
        }).unwrap();
        console.log(res);
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        console.log(err?.data?.message || err.error);
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Register</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="profilePic">
          <Form.Label>Profile Pic</Form.Label>
          <Form.Control
            type="text"
            placeholder="Upload an image for profile picture"
            value={profilePicture}
            onChange={(e) => setProfilePic(e.target.value)}
          ></Form.Control>
          <Form.Control
            label="Choose File"
            onChange={uploadProfileFileHandler}
            type="file"
          ></Form.Control>
          {loadingUpload && <Loader />}
        </Form.Group>

        <Form.Group controlId="isMechanic" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Are you a mechanic?"
            checked={isMechanic}
            onChange={(e) => setIsMechanic(e.target.checked)}
          />
        </Form.Group>

        {isMechanic && (
          <div>
            <Form.Group className="mb-3" controlId="mechanicProfilePic">
              <Form.Label>Profile Pic</Form.Label>
              <Form.Control
                type="text"
                placeholder="Upload an image for profile picture"
                value={mechanicDetails.mechanicProfilePicture}
                onChange={(e) =>
                  setMechanicDetails({
                    ...mechanicDetails,
                    mechanicProfilePicture: e.target.value,
                  })
                }
              ></Form.Control>
              <Form.Control
                label="Choose File"
                onChange={uploadMechanicProfileFileHandler}
                type="file"
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group className="my-2" controlId="specialty">
              <Form.Label>Specialty</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your specialty"
                value={mechanicDetails.specialty}
                onChange={(e) =>
                  setMechanicDetails({
                    ...mechanicDetails,
                    specialty: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="experience">
              <Form.Label>Experience</Form.Label>
              <Form.Control
                type="number"
                placeholder="Years Of Experience"
                value={mechanicDetails.experience}
                onChange={(e) =>
                  setMechanicDetails({
                    ...mechanicDetails,
                    experience: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="shopAddress">
              <Form.Label>Shop Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Where is your shop located"
                value={mechanicDetails.shopAddress}
                onChange={(e) =>
                  setMechanicDetails({
                    ...mechanicDetails,
                    shopAddress: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="shopName">
              <Form.Label>Shop Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name of your shop"
                value={mechanicDetails.shopName}
                onChange={(e) =>
                  setMechanicDetails({
                    ...mechanicDetails,
                    shopName: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="workingHours">
              <Form.Label>Working Hours</Form.Label>
              <Form.Control
                type="text"
                placeholder="Working Hours"
                value={mechanicDetails.specialty}
                onChange={(e) =>
                  setMechanicDetails({
                    ...mechanicDetails,
                    workingHours: e.target.value,
                  })
                }
              />
            </Form.Group>
          </div>
        )}

        <Button disabled={isLoading} type="submit" variant="primary">
          Register
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          Already have an account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterPage;
