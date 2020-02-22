import React, { useState } from "react";
import AbsoluteWrapper from "./AbsoluteWrapper";
import Swal from "sweetalert2";

const Login = () => {
	const [admin, setAdmin] = useState("");

	const userChangeHandler = e => {
		// console.log(e.target);
		setAdmin(e.target.value);
	};

	const login = e => {
		e.preventDefault();
		localStorage.setItem("user", admin);
		Swal.fire("Welcome!", "You successfully logged in!", "success");
		window.location = "/nowshowing";
	};

	return (
		<AbsoluteWrapper>
			<section className="hero">
				<div className="hero-body">
					<div className="container has-text-centered">
						<div className="column is-4 is-offset-4">
							<h3 className="title has-text-black">Login</h3>
							<hr className="login-hr" />
							<p className="subtitle has-text-black">
								Login as admin
							</p>
							<div className="box">
								<form>
									<div className="field">
										<div className="control">
											<input
												className="input is-large"
												type="email"
												placeholder="Your Email"
												autoFocus=""
												name="user"
												value={admin}
												onChange={userChangeHandler}
											/>
										</div>
									</div>

									<div className="field">
										<div className="control">
											<input
												className="input is-large"
												type="password"
												placeholder="Your Password"
											/>
										</div>
									</div>
									<div className="field">
										<label className="checkbox">
											<input type="checkbox" />
											Remember me
										</label>
									</div>
									<button
										className="button is-block is-info is-large is-fullwidth"
										onClick={login}
									>
										Login{" "}
										<i
											className="fa fa-sign-in"
											aria-hidden="true"
										></i>
									</button>
								</form>
							</div>
							<p className="has-text-grey">
								<a href="../">Sign Up</a> &nbsp;·&nbsp;
								<a href="../">Forgot Password</a> &nbsp;·&nbsp;
								<a href="../">Need Help?</a>
							</p>
						</div>
					</div>
				</div>
			</section>
		</AbsoluteWrapper>
	);
};

export default Login;
