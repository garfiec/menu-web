import {verifyAndGetUser} from "@/api/menu/user";
import router from "@/routes/routes";

export function loadUser({redirect}: {redirect: boolean} = {redirect: false}) {
    verifyAndGetUser().then((username) => {
        if (username) {
            localStorage.setItem('username', username);
            console.log(`User ${username} is logged in`);
        } else {
            localStorage.removeItem('username');
            if (redirect) {
                router.push({name: 'SettingsView'});
            }
        }
    });
}

export function requireLogin() {
    loadUser({redirect: true});
}
