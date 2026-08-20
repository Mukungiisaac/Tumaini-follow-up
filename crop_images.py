import os
from PIL import Image

def crop_avatars():
    os.makedirs('public/assets/children', exist_ok=True)
    os.makedirs('public/assets/mentors', exist_ok=True)
    
    # Open Page 1 (Samuel O profile)
    if os.path.exists('Page 1.jpeg'):
        img1 = Image.open('Page 1.jpeg')
        w, h = img1.size
        # Samuel O image is in the big card on left
        # Relative coordinates approx: x: 26% to 56%, y: 15% to 55%
        samuel_box = (int(w * 0.25), int(h * 0.12), int(w * 0.56), int(h * 0.56))
        samuel_img = img1.crop(samuel_box)
        samuel_img.save('public/assets/children/samuel_o.jpg')
        print("Cropped samuel_o.jpg", samuel_img.size)

    # Open Page 2 (Children directory: Elias, Amina, Samuel Ochieng, Grace)
    if os.path.exists('Page 2.jpeg'):
        img2 = Image.open('Page 2.jpeg')
        w, h = img2.size
        # Elias Kariuki (card 1)
        elias_box = (int(w * 0.266), int(h * 0.485), int(w * 0.320), int(h * 0.550))
        img2.crop(elias_box).save('public/assets/children/elias_k.jpg')

        # Amina Hassan (card 2)
        amina_box = (int(w * 0.452), int(h * 0.485), int(w * 0.505), int(h * 0.550))
        img2.crop(amina_box).save('public/assets/children/amina_h.jpg')

        # Samuel Ochieng (card 3)
        samuel_och_box = (int(w * 0.638), int(h * 0.485), int(w * 0.690), int(h * 0.550))
        img2.crop(samuel_och_box).save('public/assets/children/samuel_och.jpg')

        # Grace Wanjiku (card 4)
        grace_box = (int(w * 0.824), int(h * 0.485), int(w * 0.876), int(h * 0.550))
        img2.crop(grace_box).save('public/assets/children/grace_w.jpg')
        print("Cropped Page 2 children avatars")

    # Open Page 3 (Needs Attention: Sarah M, David K, Esther L; Mentor Sarah Johnson)
    if os.path.exists('Page 3.jpeg'):
        img3 = Image.open('Page 3.jpeg')
        w, h = img3.size
        # Sarah Johnson (mentor header)
        mentor_box = (int(w * 0.942), int(h * 0.018), int(w * 0.975), int(h * 0.055))
        img3.crop(mentor_box).save('public/assets/mentors/sarah_j.jpg')

        # Sarah M (Needs attention 1)
        sarah_m_box = (int(w * 0.288), int(h * 0.203), int(w * 0.332), int(h * 0.245))
        img3.crop(sarah_m_box).save('public/assets/children/sarah_m.jpg')

        # David K (Needs attention 2)
        david_k_box = (int(w * 0.433), int(h * 0.203), int(w * 0.478), int(h * 0.245))
        img3.crop(david_k_box).save('public/assets/children/david_k.jpg')

        # Esther L (Needs attention 3)
        esther_l_box = (int(w * 0.578), int(h * 0.203), int(w * 0.623), int(h * 0.245))
        img3.crop(esther_l_box).save('public/assets/children/esther_l.jpg')
        print("Cropped Page 3 avatars")

if __name__ == '__main__':
    crop_avatars()
