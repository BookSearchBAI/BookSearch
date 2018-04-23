$("document").ready(function(){
		$(".user_register_first_name_info").attr("data-toggle","tooltip");
		$(".user_register_first_name_info").attr("data-placement","left");
		$(".user_register_first_name_info").attr("title","The name should start from uppercase as well as surname. Example: Yaroslav Krupa");
		
		$(".user_register_email_address_info").attr("data-toggle","tooltip");
		$(".user_register_email_address_info").attr("data-placement","left");
		$(".user_register_email_address_info").attr("title","The email should contain [@.] and have appropriate form. Examples: krupayaroslav@yandex.ru, krupayaroslav@uek.krakow.pl");
		
		$(".user_register_password_info").attr("data-toggle","tooltip");
		$(".user_register_password_info").attr("data-placement","left");
		$(".user_register_password_info").attr("title","The password should contain at least 8 symbols with uppercase,lowercase,digit and special characters[@#$%^&+=]. Example: Krupayaroslav21@");
		
		$(".user_register_confirm_password_info").attr("data-toggle","tooltip");
		$(".user_register_confirm_password_info").attr("data-placement","left");
		$(".user_register_confirm_password_info").attr("title","The password should contain at least 8 symbols with uppercase,lowercase,digit and special characters[@#$%^&+=]. Example: Krupayaroslav21@");
		
		$(".user_custom_signin_email_info").attr("data-toggle","tooltip");
		$(".user_custom_signin_email_info").attr("data-placement","left");
		$(".user_custom_signin_email_info").attr("title","Enter an email address. Examples: krupayaroslav@yandex.ru, krupayaroslav@uek.krakow.pl");
		
		$(".user_custom_signin_password_info").attr("data-toggle","tooltip");
		$(".user_custom_signin_password_info").attr("data-placement","left");
		$(".user_custom_signin_password_info").attr("title","Enter the password");
		
		$("[data-toggle='tooltip']").tooltip(); 
});