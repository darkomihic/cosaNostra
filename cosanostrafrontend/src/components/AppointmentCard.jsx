import UserPng from '../assets/User.png';
import Scissors from '../assets/scissor 2.png';
import Clock from '../assets/Clock.png';
import Calendar from '../assets/Calendar.png';


function AppointmentCard({ barberName, barberSurname, appointmentDate, appointmentTime, serviceName }) {
  return (
    <div className="max-w-sm mx-8 bg-black rounded-lg shadow-lg p-6 text-zinc-200 m-4">
      {/* Appointment info with icons */}
      <div className="flex items-center mb-4">
        <img src={UserPng} />
        <p className="text-lg font-semibold pl-4">{`${barberName} ${barberSurname}`}</p>
      </div>
      <div className="flex items-center mb-4">
        <img src={Scissors} />
        <p className="text-lg font-semibold pl-4">{serviceName}</p>
      </div>
      <div className="flex items-center mb-4">
        <img src={Clock} />
        <p className="text-lg font-semibold pl-4">{appointmentTime}</p>
      </div>
      <div className="flex items-center mb-6">
        <img src={Calendar} />
        <p className="text-lg font-semibold pl-4">{appointmentDate}</p>
      </div>

    
    </div>
  );
}

export default AppointmentCard;
