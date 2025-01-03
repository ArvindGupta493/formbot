import { useState, useEffect } from 'react';
import style from './FormDashboard.module.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme-context';
import axios from 'axios';

const FormDashboard = () => {
    const navigate = useNavigate();
    const [boolean, setBoolean] = useState(false);
    const username = localStorage.getItem('name') || 'User'; // Fallback to 'User' if not found
    const [createShowModal, setCreateShowModal] = useState(false);
    const [createFormShowModal, setCreateFormShowModal] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState(null);
    const [confirmDeleteModel, setConfirmDeleteModel] = useState(false);
    const [confirmDeleteFormModel, setConfirmDeleteFormModel] = useState(false);
    const [newFormToDelete, setNewFormToDelete] = useState(null);
    const [createInput, setCreateInput] = useState('');
    const [createFolders, setCreateFolders] = useState([]);
    const [newForm, setNewForm] = useState([]);
    const [newFormName, setNewFormName] = useState("");
    const [permission, setPermission] = useState("edit"); // Permission state
    const { theme, toggleTheme } = useTheme();
    const folderId = localStorage.getItem('folderId');
    const formId = localStorage.getItem('formId');
      
    console.log("folderid", folderId);

    const handleInputChange = (e) => {
        setCreateInput(e.target.value);
    };

    const handleAddFolder = () => {
        setCreateShowModal(true);
    };

    const fetchFolders = async () => {
        try {
            const response = await axios.get(
                "http://localhost:4000/api/folders/folders/:id",
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            setCreateFolders(response.data.output);
        } catch (error) {
            console.error("Error fetching folders:", error);
        }
    };

    useEffect(() => {
        fetchFolders();
    }, []);

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!createInput) return;

        try {
            const response = await axios.post(
                "http://localhost:4000/api/folders/create-folder",
                { name: createInput },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            setCreateFolders([...createFolders, response.data.folder]);
            setCreateInput("");
            setCreateShowModal(false);
        } catch (error) {
            console.error("Error creating folder:", error);
        }
    };

    const handleFolderClick = (folderId) => {
        localStorage.setItem("folderId", folderId);
        setFolderToDelete(folderId);
        setConfirmDeleteModel(true);
        folderToDelete
    };

    const handleDeleteFolder = async () => {
        try {
            await axios.delete(
                `http://localhost:4000/api/folders/folder/${folderId}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            const updatedFolders = createFolders.filter((folder) => folder._id !== folderId);
            setCreateFolders(updatedFolders);
            setConfirmDeleteModel(false);
        } catch (error) {
            console.error("Error deleting folder:", error);
        }
    };

    const handleCancelDelete = () => {
        setFolderToDelete(null);
        setConfirmDeleteModel(false);
        setNewFormToDelete(null);
        setConfirmDeleteFormModel(false);
        newFormToDelete
    };

    const handleCreateFormModal = () => {
        if (!folderId) {
            alert("Please select a folder first.");
            return;
        }
        setCreateFormShowModal(true);
    };

    const handleFormInputChange = (e) => {
        setNewFormName(e.target.value);
    };

    const handleCreateFormSubmit = async (e) => {
        e.preventDefault();
        if (!newFormName) {
            alert("Please enter a name for the form.");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:4000/api/folders/folder/${folderId}/create-form`,
                { name: newFormName },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            const createdForm = response.data.form;
            setNewForm((prevForms) => [...prevForms, createdForm]);
            localStorage.setItem("formId", createdForm._id);
            navigate("/workspace");
            setCreateFormShowModal(false);
            setNewFormName(""); // Clear the input after form is created
        } catch (error) {
            console.error("Error creating form:", error);
        }
    };

    const handleCancelCreateForm = () => {
        setCreateFormShowModal(false);
        setNewFormName(""); // Clear input when canceling
    };

    const handleFormClick = (formId) => {
        localStorage.setItem("formId", formId);
        navigate("/workspace");
    };

    const handleFormId = (id) => {
        localStorage.setItem("formId", id);
        setNewFormToDelete(id);
        setConfirmDeleteFormModel(true);
    };

    const handlegetForms = async (item) => {
        localStorage.setItem("folderId", item._id);

        try {
            const response = await axios.get(
                `http://localhost:4000/api/folders/folders/${item._id}/forms`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            setNewForm(Array.isArray(response.data.forms) ? response.data.forms : []);
            if (response.data.forms.length > 0) {
                localStorage.setItem("formId", response.data.forms[0]._id);
            }
        } catch (error) {
            console.error("Error fetching forms:", error);
        }
    };

    const handleDeleteForm = async () => {
        try {
            await axios.delete(
                `http://localhost:4000/api/folders/form/${formId}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            const updatedForms = newForm.filter((form) => form._id !== formId);
            setNewForm(updatedForms);
            setConfirmDeleteFormModel(false);
        } catch (error) {
            console.error("Error deleting form:", error);
        }
    };

    const handleSetting = (e) => {
        const setting = e.target.value;
        if (setting === "setting") {
            navigate(`/${setting}`);
        } else {
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("formId");
        localStorage.removeItem("folderId");
        alert("Logged out successfully!");
        navigate('/login');
    };

    // Handle Permission Change
    const handlePermissionChange = (e) => {
        setPermission(e.target.value);
        console.log("Permission changed:", e.target.value);  // This will log the new permission value
    };
    
    // Handle Copy Link
    const handleCopyLink = () => {
        // Retrieve the user's ID from localStorage
        const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage
        const link = `http://localhost:5137/form-dashboard/${userId}/${permission}`; 

        navigator.clipboard.writeText(link).then(() => {
            alert(`Link copied with ${permission} permission`);
        }).catch(err => {
            console.error('Error copying link:', err);
        });
    };
    

    return (
        <>
            <div className={style.Main_Container}>
                {/* Navbar */}
                <div className={style.workspace_Navbar}>
                    <div className={style.navbar}>
                        <select name="dropdown" id="dropdown" onChange={handleSetting}>
                            {/* <option value="name"> Arivnd workspace</option> */}
                            <option value="name">{username} workspace</option>
                            <option value="setting" className={style.setting}>Settings</option>
                            <option value="logout" className={style.logout}>Log Out</option>
                        </select>
                    </div>
                    <div className={style.NavShare}>
                        <div className={style.dark}>
                            <p>Light</p>
                            <label className={style.switch}>
                                <input type="checkbox"
                                    onChange={toggleTheme}
                                    checked={theme == 'dark'}
                                />
                                <span className={`${style.slider} ${style.round}`}></span>
                            </label>
                            <p>Dark</p>
                        </div>
                        <div className={style.share}>
                            <button onClick={() => setBoolean(true)}>Share</button>
                        </div>
                    </div>
                </div>

                {/* Folder creation and management */}
                <div className={style.Main_Createrfolder}>
                    <div className={style.Ineercreate_folder}>
                        <div className={style.Create_Folder}>
                            <div className={style.Folder}>
                                <span onClick={handleAddFolder}><i className="fa-solid fa-folder-plus"></i>Create a folder</span>
                                {createFolders.map((folder, index) => (
                                    <div key={index} className={style.New_folder} onClick={() => { handlegetForms(folder) }}>
                                        {folder.name}
                                        <i className="fa-solid fa-trash-can" onClick={() => handleFolderClick(folder._id)}></i>
                                    </div>
                                ))}
                            </div>

                            {/* Form creation */}
                            <div className={style.Folder_Form}>
                                <div className={style.Folder_File} onClick={handleCreateFormModal}>
                                    <span>+</span>
                                    <p>Create a typebot</p>
                                </div>
                                {newForm.map((form, index) => (
                                    <div key={index} className={style.New_folderForm} onClick={() => handleFormClick(form._id)}>
                                        <i className="fa-solid fa-trash-can" onClick={(e) => { e.stopPropagation(); handleFormId(form._id); }}></i>
                                        <h3>{form.name || "Unnamed Form"}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Share with email modal */}
                    {boolean && (
                        <div className={style.Share_Model} onClick={() => setBoolean(false)}>
                            <div className={style.inner_shareModel}>
                                <form onClick={(e) => e.stopPropagation()}>
                                    <div className={style.Sharemodel_Cross}>
                                        <span onClick={() => setBoolean(false)}>x</span></div>
                                    <div className={style.shareModel_mail}>
                                        <label htmlFor="email">Invite by Email
                                            <select name="edit" id="edit" onChange={handlePermissionChange}>
                                                <option value="edit">Edit</option>
                                                <option value="view">View</option>
                                            </select>
                                        </label>
                                        <input type="email" name='email' placeholder="Enter email id" />
                                    </div>
                                    <button>Send Invite</button>
                                    <p>Invite by link</p>
                                    <button onClick={handleCopyLink}>Copy link</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Folder creation modal */}
                    {createShowModal && (
                        <div className={style.Create_folder_modal}>
                            <div className={style.Create_folder_modalContent}>
                                <form onSubmit={handleCreateFolder}>
                                    <h3>Create New Folder</h3>
                                    <input
                                        type="text"
                                        placeholder="Enter folder name"
                                        value={createInput}
                                        onChange={handleInputChange}
                                        className={style.Create_folder_modalInput}
                                        required
                                    />
                                    <div className={style.Create_folder_modalActions}>
                                        <button className={style.doneButton} type='submit'>Done</button>
                                        <span className={style.line}>|</span>
                                        <button className={style.cancelButton} onClick={() => setCreateShowModal(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Form creation modal */}
                    {createFormShowModal && (
                        <div className={style.Create_folder_modal}>
                            <div className={style.Create_folder_modalContent}>
                                <form onSubmit={handleCreateFormSubmit}>
                                    <h3>Create New Form</h3>
                                    <input
                                        type="text"
                                        placeholder="Enter form name"
                                        value={newFormName}
                                        onChange={handleFormInputChange}
                                        className={style.Create_folder_modalInput}
                                        required
                                    />
                                    <div className={style.Create_folder_modalActions}>
                                        <button className={style.doneButton} type="submit">Done</button>
                                        <span className={style.line}>|</span>
                                        <button className={style.cancelButton} onClick={handleCancelCreateForm}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Confirm Delete Modals */}
                    {confirmDeleteModel && (
                        <div className={style.Create_delete_modal}>
                            <div className={style.Create_folder_modalContent}>
                                <h3>Are you sure you want to delete this folder?</h3>
                                <div className={style.Create_folder_modalActions}>
                                    <button className={style.doneButton} onClick={handleDeleteFolder}>Confirm</button>
                                    <span className={style.line}>|</span>
                                    <button className={style.cancelButton} onClick={handleCancelDelete}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {confirmDeleteFormModel && (
                        <div className={style.Create_delete_modal}>
                            <div className={style.Create_folder_modalContent}>
                                <h3>Are you sure you want to delete this form?</h3>
                                <div className={style.Create_folder_modalActions}>
                                    <button className={style.doneButton} onClick={handleDeleteForm}>Confirm</button>
                                    <span className={style.line}>|</span>
                                    <button className={style.cancelButton} onClick={handleCancelDelete}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default FormDashboard;

