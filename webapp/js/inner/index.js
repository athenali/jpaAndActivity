
$(function() {
	$('#changePasswordForm').validate({
        errorClass: 'validate-error'
    });

	$('#changePasswordBtn').click(function() {
		if (!$('#changePasswordForm').validate().form()) {
			return;
		}

		$.post('../../rs/proj/user/changePassword', {
			oldPassword: $('#index_oldPassword').val(),
			password: $('#index_password').val(),
			confirmPassword: $('#index_confirmPassword').val()
		}, function(result) {
			if (result.code == 200) {
				alert('密码修改成功');
				$('#changePasswordModal').modal('hide');
			} else {
				alert(result.message);
			}
		});
	});
});
