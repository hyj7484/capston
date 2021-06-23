import {useRouteMatch} from 'react-router-dom';

const Replay = (props) => {
  const user = props.user;
  const subject = props.subject;
  const urlMain = props.urlMain;

  const routeMatch = useRouteMatch("/replay/:id/:fileName").params;
  const video = routeMatch.id;
  console.log(routeMatch.fileName);

  const url = {
    getVideo : `${urlMain}api/mark/get/${video}/${user.id}`
  }

  return(
    <>

    </>
  )

}

export default Replay;
