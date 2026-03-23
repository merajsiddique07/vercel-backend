import { Sos } from "../model/sos.model.js";
import { User } from "../model/user.model.js";
import sendEmail from "../utils/sendEmail.js";

const sendData = async (id, location, videoUrl, time) => {
  const formatted = time.toLocaleString();
  const lat = location[0].lat;
  const lng = location[0].lng;
  const frontVideo = videoUrl[0].frontVideo;
  const backVideo = videoUrl[0].backVideo;
  const user = await User.findById(id);

  const message = `
<h3>🚨 An emergency SOS has been triggered from the Safora Safety App.</h3>

<br>

👤 <b>User Name:</b> ${user.fullname} <br>
📱 <b>Phone:</b> ${user.phone} <br>
🕒 <b>Time:</b> ${formatted} <br>

<br>

📍 <b>Location:</b> <br>
Google Maps Link: 
<a href="https://www.google.com/maps?q=${lat},${lng}">
View Location
</a>

<br><br>

🎥 <b>Emergency Video Evidence</b> <br>

📷 Front Camera Video: 
<a href="${frontVideo}" target="_blank">
Watch Front Camera
</a>

<br>

📷 Back Camera Video: 
<a href="${backVideo}" target="_blank">
Watch Back Camera
</a>

<br><br>

⚠️ <b>This indicates that the user may be in danger and needs immediate help.</b>

<br><br>

Please contact the user or emergency services immediately.

<br><br>

— <b>Safora Women Safety System</b>  
Protecting Her, Every Moment.
`;

  await sendEmail(
    user.emergencyContact.email,
    "🚨 URGENT: Safora SOS Alert Triggered",
    message,
  );
};

export const sosTriggered = async (req, res) => {
  try {
    const data = req.body;
    if (data) {
      const newSos = await Sos.create(data);
      const user = await User.findById(data.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.sosHistory.push(newSos._id);
      await user.save();
      //  console.log(newSos.createdAt);
      await sendData(
        data.userId,
        data.location,
        data.videoUrl,
        newSos.createdAt,
      );

      return res.status(201).json({ message: "Data saved!" });
    }
    res.status(404).json({ message: "Data does not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const sosHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const sosData = await Sos.find({ userId: id });
    if (!sosData) {
      return res.status(404).json({ message: "User does not exists!" });
    }
    return res.status(200).json({ message: "data", sosData });
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};
