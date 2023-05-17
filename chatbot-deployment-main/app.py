import re
from distutils.log import debug
from email import message
from os import link
from urllib import response
from flask import Flask, render_template,request,jsonify

from chat import get_response

from sqlconnect import get_answer
from chat import get_link

app = Flask(__name__)

tags={
    "tg1":"tg58|tg59$Domestic Student|International Student",
    "tg3":"tg16|tg17$Acadamic Courses|Additional Courses",
    "tg58":"tg60|tg61|tg62$Counselling Procedure| Addmission Procedure|Registation fees",
    "tg59":"tg63|tg64|tg65$Counselling Procedure| Addmission Procedure|Registation fees",
    "tg2":"tg4|tg5|tg6|tg7|tg14$Address|Student Strength|Placements|Project & Grant recieved|Contact detail",
    "tg11":"tg8|tg9|tg10|tg13$Goverment Scholarship(MYSY)|CHARUSAT Meritbase Scholarship|UGSF|Other",
}

tagsdetail={
    "tg60":" You Can contact to our Departmant for the more information about Addmission: Phone Number:02697-265011 Telephone Number: 02697-265021 Email Address: info@charusat.ac.in$",
    "tg61":"Fill the Form for addmission Procedure.$https://admission.charusat.ac.in/",
    "tg62":"There is no fees to registation$",
    "tg65":"There is no fees to registation$",
    "tg63":" You Can contact to our Departmant for the more information about Addmission: Phone Number:02697-265011 Telephone Number: 02697-265021 Email Address: info@charusat.ac.in$",
    "tg64":"Fill the Form for addmission Procedure.$https://admission.charusat.ac.in/",
    "tg17":"KDPIT offers various additional courses for the better enhancement of the students. Here are some courses provided such as AWS solution Architecture and AWS Foundation, Advance Ethical Hacking, BlockChain and many more$",
    "tg16":"To know about Acadamic Courses of a year $https://www.charusat.ac.in/Downloads/Syllabus/FTE%20CSPIT/IT/archive/BTech_IT_Booklet_2021-22.pdf",
    "tg5":"In KDPIT We Have around 1000+ Student$",
    "tg6":"Our Placement is 100% in year 2021-22. KDPIT offers 120 seats in Btech and 15 Seats in PGDCS$",
    "tg7":"About 48+ We recevied Grant & Projects and 43+ Workshop Organized.$",
    "tg14":"To Conact Us: Phone Number- +91-2697-265131 Email : hod.it@charusat.ac.in$",
    "tg15":"To Conact Us: Phone Number- +91-2697-265131 Email : hod.it@charusat.ac.in$",
    "tg4":"Smt. Kundanben Dinsha Patel Department of Information Technology Charotar University of Science and Technology CHARUSAT Campus, Changa Taluka: Petlad, Dist: Anand Gujarat (India) 388 421$",
    "tg8":"All students of SC, ST and SEBC category, Free ship card for SC students, Chief Minister Scholarship Scheme, Mukhyamantri Yuva Swavalamban Yojna (MYSY) Click here for More Details..$https://mysy.guj.nic.in/",
    "tg9":"CHARUSAT University believes that money should not be a road block for a student with innovative ideas and passion.The merit scholarships help meritorious students to pursue their career goals student with High CGPA and not more then 4.5 lac income should apply for this scholarship. Student have minimim 7.00 CGPA in consecutive semester then scholarship will be awarded to other eligible student, selected by donor and recommended by CHARUSAT $",
    "tg10":"CHARUSAT offers Under Graduate (UG) Programmes in all its Faculties i.e Technology &amp; Engineering, Computer Science &amp; Applications, Pharmacy, Management, Sciences and Medical Sciences. A student to be eligible to apply for this scheme should have secured minimum 7.5 CGPA (without any FF grades in any semester) and The students for the award of UGSF shall be selected based on merit and subject to a maximum of 3% of the total UG students enrolled in that particular programme (for eg., If B.Tech (CE) Programme has total 120 students enrolled under it, then 4 students will get the UGSF benefit). However, there shall be minimum 1 fellowship available for each UG programme subject to the compliance of the eligibility criteria .$",
    "tg13":"Here many other scholarship to know more about it .$https://www.charusat.ac.in/admission/scholarship.html"
}

@app.get("/")
def index_get():
    return render_template("base.html")

@app.post("/predict")
def perdict():
    text = request.get_json().get("message")
    text.strip()
    if re.match(r"[A-Z0-9]{3}IT\d{3}", text) or re.match(r"[0-9]{2}IT\d{3}", text):
        response =get_answer(text)
        message = {"answer" : "Enter Proper or valid En-Roll number"}
        if response:
            message = {"answer" : response,"link": ""}
        else:
            message = {"answer" : "Enter Proper or valid En-Roll number","link": ""}
        return  jsonify(message)
    response =get_response(text)
    link=get_link()
    message = {"answer" : response,"link": link}
    return  jsonify(message)

@app.post("/tags")
def response_tags():
    text = request.get_json().get("message")
    if text in tags.keys():
        strarray=tags[text].split("$")
        message = {"check" : "tags","tagid":strarray[0],"tag":strarray[1]}
        return  jsonify(message)
    else:
        strarray=tagsdetail[text].split("$")
        message = {"check" : "msg","answer" : strarray[0],"link": strarray[1]}
        return  jsonify(message)
    

if __name__ == "__main__":
    app.run(debug=True)

