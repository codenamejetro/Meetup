import { useState, useEffect } from "react"

function CreateGroupForm() {
    const [location, setLocation] = useState('')
    const [groupName, setGroupName] = useState('')
    const [groupAbout, setGroupAbout] = useState('')
    const [online, setOnline] = useState('')
    const [isPrivate, setIsPrivate] = useState('')
    const [img, setImg] = useState('')


    return (
        <>
            <div>
                <p>BECOME AN ORGANIZER</p>
                <p>We'll walk you through a few steps to build your local community</p>
            </div>
            <form>

                <label>
                    First, set your group's location
                    <p>SeparateDown groups meet locally, in person and online. We'll connect you with people
                        in your area, and more can join you online.</p>
                    <input
                        type="text"
                        name="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder={'City, STATE'}
                    />
                </label>


                <label>
                    What will your group's name be?
                    <p>Choose a name that will give people a clear idea of what the group is about.
                        Feel free to get creative! You can edit this later if you change your mind.</p>
                    <input
                        type="text"
                        name="group-name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder={'What is your group name?'}
                    />
                </label>


                <label htmlFor='group-about'>
                    Now describe what your group will be about
                    <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
                    <div>
                        1, What's the purpose of the group?
                        2. Who should join?
                        3. What will you do at your events?
                    </div>
                    <textarea id='group-about' name='group-about' rows={'5'} cols={'50'} value={groupAbout} onChange={(e) => setGroupAbout(e.target.value)} placeholder={'Please write at least 30 characters'}></textarea>
                </label>


                <label>
                    Final steps...
                    <p>Is this an in person or online group?</p>
                    <select
                        value={online}
                        onChange={(e) => setOnline(e.target.value)}
                    >
                        <option value="" disabled>(select-one)</option>

                        <option key={'in-person'}>
                            in person
                        </option>
                        <option key={'online'}>
                            online
                        </option>
                    </select>
                    <p>Is this group private or public?</p>
                    <select
                        value={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.value)}
                    >
                        <option value="" disabled>(select-one)</option>

                        <option key={'public'}>
                            public
                        </option>
                        <option key={'private'}>
                            private
                        </option>
                    </select>



                    <p>Please add an image url for your group below:</p>
                    <input
                    type="text"
                    name="img"
                    value={img}
                    onChange={(e) => setImg(e.target.value)}
                    placeholder={'Image Url'}
                    />
                </label>

                    <button>Create Group</button>

            </form>
        </>
    )
}

export default CreateGroupForm
