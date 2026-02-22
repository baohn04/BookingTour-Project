import { useParams } from 'react-router-dom';

function ListTours() {
  const { slug } = useParams();

  return (
    <div>
      <h1>List Tours for: {slug}</h1>
    </div>
  );
}

export default ListTours;