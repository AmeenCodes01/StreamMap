import {useState} from 'react'

function useSessionStates() {

    const [seshInfo, setSeshInfo] = useState([]);
    const [allSessions, setAllSessions] = useState([])

  return{ seshInfo, setSeshInfo,allSessions, setAllSessions}
}

export default useSessionStates