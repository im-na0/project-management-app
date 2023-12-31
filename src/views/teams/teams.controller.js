import { db } from '/src/api/firebase'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { addTeamToHTML, createTeamCard } from './teamList'
import { lazyLoad } from '/src/utils/lazyLoadUtils'
import * as bootstrap from 'bootstrap'
import './teams.scss'

export function initTeams() {
  const sortByTeam = (members) => {
    members.sort((a, b) => {
      return a.team.localeCompare(b.team)
    })
    return members
  }

  const getAllTeams = () => {
    return new Promise((resolve, reject) => {
      try {
        const queryCollection = query(collection(db, 'members'))
        const unsubscribe = onSnapshot(queryCollection, (querySnapshot) => {
          const teamNames = new Set()
          querySnapshot.forEach((doc) => {
            teamNames.add(doc.data().team)
          })

          const teamsArray = Array.from(teamNames)
          resolve(teamsArray)
        })
      } catch (error) {
        console.error('팀 목록 가져오기 오류:', error)
        reject(error)
      }
    })
  }

  const getUsersByTeam = (teamName) => {
    return new Promise((resolve, reject) => {
      try {
        const queryCollection = query(collection(db, 'members'), where('team', '==', teamName), orderBy('name'))
        const unsubscribe = onSnapshot(queryCollection, (querySnapshot) => {
          const members = querySnapshot.docs.map((doc) => doc.data())
          resolve(members)
        })
      } catch (error) {
        console.error('데이터 가져오기 오류:', error)
        reject(error)
      }
    })
  }

  const main = async () => {
    try {
      const teamNames = await getAllTeams()
      for (const teamName of teamNames) {
        const members = await getUsersByTeam(teamName)
        const sortedMembers = sortByTeam(members)
        const teamData = {
          teamName: teamName,
          members: sortedMembers,
        }

        const teamCard = createTeamCard(teamData)

        addTeamToHTML(teamCard)
        lazyLoad()
      }
    } catch (error) {
      console.error('전체 프로세스 오류:', error)
    }
  }

  main()
}
