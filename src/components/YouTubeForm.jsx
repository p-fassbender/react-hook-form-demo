import React, { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

let renderCount = 0

export const YouTubeForm = () => {
    const form = useForm({
        defaultValues: {
            username: 'melon',
            email: '',
            channel: '',
            social: {
                twitter: '',
                facebook: ''
            },
            phoneNumbers: ['', ''],
            phNumbers: [{ number: '' }],
            age: 0,
            dob: new Date()
        },
        mode: 'onSubmit'
        // mode: 'onBlur'
        // mode: 'onTouched'
        // mode: 'onChange'
        // mode: 'all'
    })
    // const form = useForm({
    //     defaultValues: async () => {
    //         const response = await fetch('https://jsonplaceholder.typicode.com/users/1')
    //         const data = await response.json();
    //         return {
    //             username: data.username,
    //             email: data.email,
    //             channel: ''
    //         }
    //     }
    // })
    const { register, control, handleSubmit, formState, watch, getValues, setValue, reset, trigger } = form
    const { errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount } = formState

    console.log({ touchedFields, dirtyFields, isDirty })
    console.log({ isSubmitting, isSubmitted, isSubmitSuccessful, submitCount })

    const { fields, append, remove } = useFieldArray({
        name: 'phNumbers',
        control
    })

    const onSubmit = (data) => {
        console.log('form submitted', data)
    }

    const onError = (errors) => {
        console.log('form errors: ', errors)
    }

    const handleGetValues = () => {
        // console.log('get values', getValues())
        // console.log('get values', getValues('social'))
        // console.log('get values', getValues('social.twitter'))
        console.log('get values', getValues(['username', 'email']))
    }

    const handleSetValue = () => {
        setValue('username', 'banana', {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        })
    }

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset()
        }
    }, [isSubmitSuccessful, reset])

    // const watchUsername = watch('username')
    // const watchUsername = watch(['username', 'email'])
    // const watchForm = watch()
    // useEffect(() => {
    //     const subscription = watch((value) => {
    //         console.log(value)
    //     })
    //     return () => subscription.unsubscribe()
    // }, [watch])

    renderCount++
    return (
        <>
            <h1>YouTube Form ({renderCount / 2})</h1>
            {/* <h2>watched value: {watchUsername}</h2> */}
            {/* <h2>watched value: {JSON.stringify(watchForm)}</h2> */}

            <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                <div className='form-control'>
                    <label htmlFor='username'>username</label>
                    <input
                        type='text'
                        id='username'
                        {...register('username', {
                            required: 'username is required'
                        })}
                    />
                    <p className='error'>{errors.username?.message}</p>
                </div>

                <div className="form-control">
                    <label htmlFor='email'>email</label>
                    <input
                        type='email'
                        id='email'
                        {...register('email', {
                            pattern: {
                                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                message: 'invalid email format'
                            },
                            required: 'email is required',
                            validate: {
                                notAdmin: (fieldValue) => {
                                    return (fieldValue !== 'admin@admin.com' || 'enter a different email address')
                                },
                                notBlackListed: (fieldValue) => {
                                    return !fieldValue.endsWith('baddomain.com') || 'this domain is not supported'
                                },
                                emailAvailable: async (fieldValue) => {
                                    const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`)
                                    const data = await response.json()
                                    return data.length == 0 || 'email already exists'
                                }
                            }
                        })}
                    />
                    <p className='error'>{errors.email?.message}</p>
                </div>

                <div className="form-control">
                    <label htmlFor='channel'>channel</label>
                    <input
                        type='text'
                        id='channel'
                        {...register('channel', {
                            required: 'channel is required'
                        })}
                    />
                    <p className='error'>{errors.channel?.message}</p>
                </div>

                <div className="form-control">
                    <label htmlFor='twitter'>twitter</label>
                    <input
                        type='text'
                        id='twitter'
                        {...register('social.twitter', {
                            required: 'twitter is required',
                            // disabled: true
                            disabled: watch('channel') === ''
                        })}
                    />
                    <p className='error'>{errors.social?.twitter?.message}</p>
                </div>

                <div className="form-control">
                    <label htmlFor='facebook'>facebook</label>
                    <input
                        type='text'
                        id='facebook'
                        {...register('social.facebook')}
                    />
                </div>

                <div className="form-control">
                    <label htmlFor='primary-phone'>primary phone number</label>
                    <input
                        type='text'
                        id='primary-phone'
                        {...register('phoneNumbers.0', {
                            required: 'primary phone number is required'
                        })}
                    />
                    <p className='error'>{errors.phoneNumbers?.[0]?.message}</p>
                </div>

                <div className="form-control">
                    <label htmlFor='secondary-phone'>secondary phone number</label>
                    <input
                        type='text'
                        id='secondary-phone'
                        {...register('phoneNumbers.1')}
                    />
                </div>

                <div>
                    <label>List of phone numbers</label>
                    <div>
                        {
                            fields.map((field, index) => {
                                return (
                                    <div className="form-control" key={field.id}>
                                        <input type='text' {...register(`phNumbers.${index}.number`)} />
                                        {
                                            index > 0 && (
                                                <button type='button' onClick={() => remove(index)}>remove</button>
                                            )
                                        }
                                    </div>
                                )
                            })
                        }
                        <button type='button' onClick={() => append({ number: '' })}>add phone number</button>
                    </div>
                </div>

                <div className="form-control">
                    <label htmlFor='age'>age</label>
                    <input
                        type='number'
                        id='age'
                        {...register('age', {
                            valueAsNumber: true,
                            required: 'age is required'
                        })}
                    />
                    <p className='error'>{errors.age?.message}</p>
                </div>

                <div className="form-control">
                    <label htmlFor='date'>date of birth</label>
                    <input
                        type='date'
                        id='date'
                        {...register('date', {
                            valueAsDate: true,
                            required: 'date is required'
                        })}
                    />
                    <p className='error'>{errors.date?.message}</p>
                </div>

                <button disabled={!isDirty || !isValid || isSubmitting}>submit</button>
                <button type='button' onClick={handleGetValues}>get values</button>
                <button type='button' onClick={handleSetValue}>set value</button>
                <button type='button' onClick={() => reset()}>reset</button>
                <button type='button' onClick={() => trigger()}>validate</button>
            </form>
            <DevTool control={control} />
        </>
    )
}
