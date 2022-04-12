import React, { useEffect, useState } from "react";
import ImageCanvas from "../../../components/image-canvas";
import RichTextEditor from "react-rte";
import { ToolBarConfig } from "../../../constants";
import { createTopSpeaker, getTopSpeakers } from "../../../store/top-speaker-store/topSpeakerActions";
import { useDispatch, useSelector } from "react-redux";
import { ITopSpeakerFormData, ITopSpeakerState } from "../../../interfaces";
import { translation } from "../../../locales/en-US/translation.json";

let formData: ITopSpeakerFormData = {
	imageSrc: null,
	topSpeakerName: null,
	description: null,
	socialMediaURLs: { facebook: null, instagram: null, twitter: null, linkedIn: null, web: null },
};

const initialState: ITopSpeakerState = {
	topSpeakerId: "",
	isFormNotValid: false,
	imageSrc: null,
	topSpeakerName: "",
	description: "",
	facebook: "",
	instagram: "",
	twitter: "",
	linkedIn: "",
	web: "",
};

const AddTopSpeaker: React.FC = () => {
	const dispatch = useDispatch();
	const state = useSelector((state) => state.topSpeakerReducer);
	const [editor, setEditor] = useState(() => RichTextEditor.createEmptyValue());
	const [
		{ topSpeakerName, description, imageSrc, isFormNotValid, facebook, instagram, twitter, linkedIn, web },
		setState,
	] = useState(initialState);

	useEffect(() => {
		dispatch(getTopSpeakers());
		closeModal();
	}, [state.addTopSpeaker, dispatch]);

	const closeModal = () => {
		setState({ ...initialState });
		setEditor(RichTextEditor.createEmptyValue());
		$("#addTopSpeakerModal").modal("hide");
	};

	const onChange = (topSpeaker: any) => {
		const { name, value } = topSpeaker.target;
		setState((prevState) => ({ ...prevState, [name]: value }));
	};

	const onChangeSocialMedia = (topSpeaker: any) => {
		const { name, value } = topSpeaker.target;
		setState((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleImage = (data: any) => {
		setState((prevState) => ({ ...prevState, imageSrc: data }));
	};

	const handleDescription = (value: any) => {
		setEditor(value);
		const isEmpty = !value.getEditorState().getCurrentContent().getPlainText().trim();

		if (isEmpty) {
			setState((prevState) => ({
				...prevState,
				description: null,
			}));
		} else {
			setState((prevState) => ({
				...prevState,
				description: value.toString("html"),
			}));
		}
	};

	// Form Validation
	const validateForm = () => {
		const data = {
			imageSrc: imageSrc ? imageSrc : null,
			topSpeakerName: topSpeakerName && topSpeakerName.trim().length > 0 ? topSpeakerName : null,
			description: description && description.trim().length > 0 ? description : null,
			socialMediaURLs: {
				facebook: facebook && facebook.trim().length > 0 ? facebook : null,
				instagram: instagram && instagram.trim().length > 0 ? instagram : null,
				twitter: twitter && twitter.trim().length > 0 ? twitter : null,
				linkedIn: linkedIn && linkedIn.trim().length > 0 ? linkedIn : null,
				web: web && web.trim().length > 0 ? web : null,
			},
		};

		formData = Object.assign({}, data);
		return true;
	};

	// Form Submission
	const onSubmit = (topSpeaker: any) => {
		topSpeaker.preventDefault();

		const isFormValid = validateForm();

		if (isFormValid) {
			let data = Object.values(formData).map((item) => {
				return item !== null;
			});

			if (!data.includes(false)) {
				setState((prevState) => ({ ...prevState, isFormNotValid: false }));

				let topSpeakerFormData = new FormData();
				topSpeakerFormData.append("topSpeakerFlyer", imageSrc); //need to recheck
				topSpeakerFormData.append("title", topSpeakerName as string);
				topSpeakerFormData.append("description", description as string);
				topSpeakerFormData.append("socialMediaURLs.facebook", facebook as string);
				topSpeakerFormData.append("socialMediaURLs.instagram", instagram as string);
				topSpeakerFormData.append("socialMediaURLs.twitter", twitter as string);
				topSpeakerFormData.append("socialMediaURLs.linkedIn", linkedIn as string);
				topSpeakerFormData.append("socialMediaURLs.web", web as string);

				dispatch(createTopSpeaker(topSpeakerFormData));
			} else {
				setState((prevState) => ({ ...prevState, isFormNotValid: true }));
			}
		}
	};

	return (
		<div
			className="modal fade"
			id="addTopSpeakerModal"
			tabIndex={-1}
			data-mdb-backdrop="static"
			data-mdb-keyboard="false"
			aria-labelledby="addTopSpeakerModalLabel"
			aria-hidden="true"
		>
			<div className="modal-dialog modal-lg">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="addTopSpeakerModalLabel">
							{translation.forms["top-speakers"].title}
						</h5>
						<button type="button" className="btn-close" onClick={closeModal}></button>
					</div>
					<div className="modal-body add-topSpeaker">
						<ImageCanvas width={300} height={300} getEditedImage={handleImage} />
						<div className="d-flex justify-content-center">
							{formData.imageSrc === null && isFormNotValid ? (
								<span className="text-danger validation-message my-2">
									{translation.forms["top-speakers"]["validation-message"]["top-speakers-image"]}
								</span>
							) : null}
						</div>

						<div className="mx-5">
							<div className="form-group row my-3">
								<label className="col-sm-3 col-form-label form-label text-dark">
									<i className="far fa-file-alt fa-sm" />
									&nbsp;{translation.forms["top-speakers"].label["top-speakers-title"]}
								</label>
								<div className="col-sm-9">
									<input
										type="text"
										name="topSpeakerName"
										value={topSpeakerName as string}
										className="form-control"
										onChange={onChange}
									/>
									{formData.topSpeakerName === null && isFormNotValid ? (
										<span className="text-danger validation-message">
											{translation.forms["top-speakers"]["validation-message"]["top-speakers-title"]}
										</span>
									) : null}
								</div>
							</div>

							<div className="form-group row my-3">
								<label className="col-sm-3 col-form-label form-label text-dark">
									<i className="fas fa-link fa-sm" />
									&nbsp;{translation.forms["top-speakers"].label.facebook}
								</label>
								<div className="col-sm-9">
									<input
										type="text"
										className="form-control"
										name="facebook"
										value={facebook as string}
										onChange={onChangeSocialMedia}
									/>
									{formData.socialMediaURLs.facebook === null && isFormNotValid ? (
										<span className="text-danger validation-message">
											{translation.forms["top-speakers"]["validation-message"].url}
										</span>
									) : null}
								</div>
							</div>

							<div className="form-group row my-3">
								<label className="col-sm-3 col-form-label form-label text-dark">
									<i className="fas fa-link fa-sm" />
									&nbsp;{translation.forms["top-speakers"].label.instagram}
								</label>
								<div className="col-sm-9">
									<input
										type="text"
										className="form-control"
										name="instagram"
										value={instagram as string}
										onChange={onChange}
									/>
									{formData.socialMediaURLs.instagram === null && isFormNotValid ? (
										<span className="text-danger validation-message">
											{translation.forms["top-speakers"]["validation-message"].url}
										</span>
									) : null}
								</div>
							</div>

							<div className="form-group row my-3">
								<label className="col-sm-3 col-form-label form-label text-dark">
									<i className="fas fa-link fa-sm" />
									&nbsp;{translation.forms["top-speakers"].label.twitter}
								</label>
								<div className="col-sm-9">
									<input
										type="text"
										className="form-control"
										name="twitter"
										value={twitter as string}
										onChange={onChange}
									/>
									{formData.socialMediaURLs.twitter === null && isFormNotValid ? (
										<span className="text-danger validation-message">
											{translation.forms["top-speakers"]["validation-message"].url}
										</span>
									) : null}
								</div>
							</div>

							<div className="form-group row my-3">
								<label className="col-sm-3 col-form-label form-label text-dark">
									<i className="fas fa-link fa-sm" />
									&nbsp;{translation.forms["top-speakers"].label.linkedIn}
								</label>
								<div className="col-sm-9">
									<input
										type="text"
										className="form-control"
										name="linkedIn"
										value={linkedIn as string}
										onChange={onChange}
									/>
									{formData.socialMediaURLs.linkedIn === null && isFormNotValid ? (
										<span className="text-danger validation-message">
											{translation.forms["top-speakers"]["validation-message"].url}
										</span>
									) : null}
								</div>
							</div>

							<div className="form-group row my-3">
								<label className="col-sm-3 col-form-label form-label text-dark">
									<i className="fas fa-link fa-sm" />
									&nbsp;{translation.forms["top-speakers"].label.website}
								</label>
								<div className="col-sm-9">
									<input type="text" className="form-control" name="web" value={web as string} onChange={onChange} />
									{formData.socialMediaURLs.web === null && isFormNotValid ? (
										<span className="text-danger validation-message">
											{translation.forms["top-speakers"]["validation-message"].url}
										</span>
									) : null}
								</div>
							</div>

							<div className="form-group row my-3">
								<label className="col-sm-12 col-form-label form-label text-dark">
									<i className="fas fa-align-left" />
									&nbsp;{translation.forms["common-label"].description}
								</label>
								<div className="col-sm-12">
									<RichTextEditor
										value={editor}
										onChange={handleDescription}
										toolbarClassName="description"
										editorClassName="description"
										toolbarConfig={ToolBarConfig}
									/>
									{formData.description === null && isFormNotValid ? (
										<span className="text-danger validation-message">
											{translation.forms["common-validation-message"].description}
										</span>
									) : null}
								</div>
							</div>
						</div>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-light shadow-none btn-rounded" onClick={closeModal}>
							{translation.buttons.common.cancel}
						</button>
						<button type="button" className="btn btn-primary shadow-none btn-rounded" onClick={onSubmit}>
							{translation.buttons.common.submit}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddTopSpeaker;
