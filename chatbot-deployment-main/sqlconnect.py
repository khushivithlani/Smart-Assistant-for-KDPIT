import string
import mysql.connector

#establishing the connection
conn = mysql.connector.connect(
   user='newuser', password='Abcdefg_085', host='localhost', database='student')

#Creating a cursor object using the cursor() method
#cursor = conn.cursor()

def get_answer(msg):
    sql = "SELECT * FROM student_details WHERE id ='"+msg+"'"
    # sql = "SELECT * FROM student_details WHERE id ='D21IT173'"
    conn = mysql.connector.connect(user='newuser', password='Abcdefg_085', host='localhost', database='student')
    mycursor = conn.cursor()
    mycursor.execute(sql)

    myresult = mycursor.fetchall()

    for x in myresult:
        str1="Name : "+x[1]+"<br> Attendance : "+x[2]+"<br> Result CGPA :"+x[5]+"<br> Fees : "+x[3]+"<br> Counsellor : "+x[4]
        return str1