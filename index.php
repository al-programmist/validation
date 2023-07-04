<?php
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $comment = $_POST['comment'];
    $agree = $_POST['agree'];
  
    if (empty($username)) 
        echo "Please enter name";
    elseif(empty($email))
        echo "Please enter email";
      elseif(empty($agree))
        echo "Please commit your data";    
    else
        echo "$username has already commited with conditions, has email $email and leaved comment: $comment";
  }
?>