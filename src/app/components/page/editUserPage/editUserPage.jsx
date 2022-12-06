import React, { useEffect, useState } from "react";
import { validator } from "../../../utils/validator";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import MultiSelectField from "../../common/form/multiSelectField";
import BackHistoryButton from "../../common/backButton";
import { useQualities } from "../../../hooks/useQualities";
import { useProfessions } from "../../../hooks/useProfession";
import { useAuth } from "../../../hooks/useAuth";

const EditUserPage = () => {
    const [isLoading, setIsLoading] = useState(true);

    const [data, setData] = useState({});

    const { professions, isLoading: loadingProfession } = useProfessions();
    const { qualities, getQuality, isLoading: loadingQualities } = useQualities();
    const { currentUser, updateUserData } = useAuth();
    const [errors, setErrors] = useState({});

    const qualitiesList = qualities.length && qualities.map(qual => ({
        value: qual._id,
        label: qual.name,
        color: qual.color
    }));

    const professionsList = professions.length && professions.map(profession => ({
        label: profession.name,
        value: profession._id
    }));

    const transformQualities = (data) => {
        return data.map(qualId => {
            const quality = getQuality(qualId);
            return { label: quality.name, value: quality._id };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        const { profession, qualities } = data;

        console.log({
            ...data,
            profession,
            qualities: qualities.map(qual => qual.value)
        });

        updateUserData({
            ...data,
            profession,
            qualities: qualities.map(qual => qual.value)
        });
    };

    useEffect(() => {
        const { profession, qualities, ...data } = currentUser;
        if (!loadingQualities && !loadingProfession) {
            setData((prevState) => ({
                ...prevState,
                ...data,
                qualities: transformQualities(qualities),
                profession: profession
            }));

            setIsLoading(false);
        }
    }, [loadingQualities, loadingProfession]);

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },
        name: {
            isRequired: {
                message: "Введите ваше имя"
            }
        }
    };

    useEffect(() => {
        validate();
    }, [data]);

    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };

    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const isValid = Object.keys(errors).length === 0;
    return (
        <div className="container mt-5">
            <BackHistoryButton />
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {!isLoading ? (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Имя"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                label="Электронная почта"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <SelectField
                                label="Выбери свою профессию"
                                defaultOption="Choose..."
                                options={professionsList}
                                name="profession"
                                onChange={handleChange}
                                value={data.profession}
                                error={errors.profession}
                            />
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" },
                                    { name: "Other", value: "other" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                                label="Выберите ваш пол"
                            />
                            <MultiSelectField
                                defaultValue={data.qualities}
                                options={qualitiesList}
                                onChange={handleChange}
                                name="qualities"
                                label="Выберите ваши качества"
                            />
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary w-100 mx-auto"
                            >
                                Обновить
                            </button>
                        </form>
                    ) : (
                        "Loading..."
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditUserPage;
